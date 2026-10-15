
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const PIN_HASH_KEY = "deskpilot_pin_hash";
const PIN_SALT_KEY = "deskpilot_pin_salt";
const FAILED_ATTEMPTS_KEY = "deskpilot_pin_failed_attempts";
const LOCKED_UNTIL_KEY = "deskpilot_pin_locked_until";

const PIN_LENGTH = 4;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30_000;

function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );
}

export async function hasPin(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(PIN_HASH_KEY);
  const salt = await SecureStore.getItemAsync(PIN_SALT_KEY);

  return Boolean(hash && salt);
}

export async function savePin(pin: string): Promise<void> {
  if (!isValidPin(pin)) {
    throw new Error("PIN must contain exactly 4 digits.");
  }

  const salt = Crypto.randomUUID();
  const hash = await hashPin(pin, salt);

  await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
  await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
  await SecureStore.setItemAsync(FAILED_ATTEMPTS_KEY, "0");
  await SecureStore.deleteItemAsync(LOCKED_UNTIL_KEY);
}

export async function verifyPin(pin: string): Promise<boolean> {
  if (!isValidPin(pin)) {
    return false;
  }

  const lockedUntilValue = await SecureStore.getItemAsync(
    LOCKED_UNTIL_KEY
  );

  const lockedUntil = Number(lockedUntilValue || "0");

  if (Date.now() < lockedUntil) {
    const remainingSeconds = Math.ceil(
      (lockedUntil - Date.now()) / 1000
    );

    throw new Error(
      `Too many attempts. Try again in ${remainingSeconds} seconds.`
    );
  }

  const salt = await SecureStore.getItemAsync(PIN_SALT_KEY);
  const savedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);

  if (!salt || !savedHash) {
    throw new Error(
      "No PIN configured. Please set up your PIN first."
    );
  }

  const enteredHash = await hashPin(pin, salt);

  if (enteredHash === savedHash) {
    await SecureStore.setItemAsync(FAILED_ATTEMPTS_KEY, "0");
    await SecureStore.deleteItemAsync(LOCKED_UNTIL_KEY);

    return true;
  }

  const attemptsValue = await SecureStore.getItemAsync(
    FAILED_ATTEMPTS_KEY
  );

  const attempts = Number(attemptsValue || "0") + 1;

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    const newLockedUntil = Date.now() + LOCKOUT_DURATION_MS;

    await SecureStore.setItemAsync(
      LOCKED_UNTIL_KEY,
      String(newLockedUntil)
    );

    await SecureStore.setItemAsync(FAILED_ATTEMPTS_KEY, "0");

    throw new Error(
      "Too many incorrect attempts. Please wait 30 seconds."
    );
  }

  await SecureStore.setItemAsync(
    FAILED_ATTEMPTS_KEY,
    String(attempts)
  );

  return false;
}

export async function changePin(
  currentPin: string,
  newPin: string
): Promise<void> {
  const isCurrentPinValid = await verifyPin(currentPin);

  if (!isCurrentPinValid) {
    throw new Error("Current PIN is incorrect.");
  }

  if (!isValidPin(newPin)) {
    throw new Error("New PIN must contain exactly 4 digits.");
  }

  await savePin(newPin);
}

export async function removePin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  await SecureStore.deleteItemAsync(PIN_SALT_KEY);
  await SecureStore.deleteItemAsync(FAILED_ATTEMPTS_KEY);
  await SecureStore.deleteItemAsync(LOCKED_UNTIL_KEY);
}
