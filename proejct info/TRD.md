# DeskPilot — Technical Requirements Document (TRD)

**Project:** DeskPilot — Lightweight Wireless Laptop Controller  
**Document:** Technical Requirements Document  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 11 October 2026

---

## 1. Purpose

This Technical Requirements Document (TRD) describes the proposed technical architecture, software components, interfaces, security controls, configuration, and verification requirements for DeskPilot.

DeskPilot repurposes an Android phone as a wireless control panel for launching approved applications on a Windows laptop over a trusted local network.

## 2. Technical Overview

The system contains two primary components:

1. **Mobile client:** A React Native application built with Expo.
2. **Windows server:** A Node.js application using Express.js that authenticates requests and launches predefined applications.

The MVP does not require Arduino or ESP8266 hardware. The laptop must already be powered on, and the server must be running.

## 3. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Mobile UI | React Native | Screens, buttons, status and feedback |
| Mobile tooling | Expo | Development, testing and Android builds |
| Network client | Fetch API | Send HTTP requests to the laptop |
| Backend runtime | Node.js | Run the laptop-side service |
| Backend framework | Express.js | Define API routes and middleware |
| Process launching | `child_process.spawn` | Launch approved Windows applications |
| Transport | HTTP on trusted LAN for MVP | Phone-to-laptop communication |
| Target desktop | Windows | Runs the DeskPilot server and applications |
| Target phone | Android 8–10 device, 2 GB RAM | Runs the mobile client, subject to SDK compatibility |

**Compatibility note:** Expo SDK versions and Android support change over time. Select an Expo SDK that supports the target phone and validate it on the actual device. A current Expo Go app may not support an older Android version; a compatible development build or APK may be necessary.

## 4. High-Level Architecture

```text
+----------------------------------+
| Android Phone                    |
| React Native + Expo              |
|                                  |
| App buttons / Connection status  |
+----------------+-----------------+
                 |
                 | HTTP request over trusted LAN
                 | Authorization: Bearer <token>
                 v
+----------------------------------+
| Windows Laptop                   |
| Node.js + Express                |
|                                  |
| Authentication middleware        |
|             |                    |
|             v                    |
| Application allowlist            |
|             |                    |
|             v                    |
| Fixed executable path            |
| spawn(path, [], { shell: false })|
+----------------------------------+
```

### 4.1 Request Flow

1. The user opens DeskPilot on the phone.
2. The app checks the laptop server using `GET /health`.
3. The user taps an application shortcut.
4. The app sends an authenticated request for the selected application identifier.
5. The server validates the token and checks the identifier against the allowlist.
6. The server launches the configured executable without invoking a shell.
7. The app displays the request result.

## 5. Mobile Application Requirements

### 5.1 Screens and UI

The MVP should provide a single main screen containing:

- DeskPilot title and basic connection state.
- A connection-check action.
- Clearly labelled buttons for configured applications, such as Notepad, Chrome and VS Code.
- Loading feedback while a request is in progress.
- Success and failure messages.
- A simple configuration location for the laptop IP address and port, or documented constants for the first prototype.

### 5.2 Mobile Networking

- Use the Fetch API to communicate with the server.
- Use the laptop's actual local IPv4 address, not `localhost` or `127.0.0.1`.
- Send the configured authentication token in the `Authorization` header.
- Handle timeouts, network errors, non-2xx responses and invalid JSON.
- Avoid continuous polling while the app is idle.
- Do not send requests to a hard-coded sample IP in the final build.

### 5.3 Example Request

```http
GET /health HTTP/1.1
Host: 192.168.1.20:3000
Authorization: Bearer YOUR_CONFIGURED_TOKEN
```

Example launch request:

```http
POST /launch/notepad HTTP/1.1
Host: 192.168.1.20:3000
Authorization: Bearer YOUR_CONFIGURED_TOKEN
```

The IP address above is an example only. Replace it with the laptop's actual local address.

## 6. Windows Server Requirements

### 6.1 Runtime and Dependencies

- Install a supported Node.js LTS release.
- Use Express.js for routing and middleware.
- Keep the server code in a dedicated folder, for example `DeskPilotServer/`.
- Keep the list of permitted apps explicit and easy to audit.
- Do not accept executable paths or arbitrary shell commands from mobile requests.

### 6.2 Application Allowlist

The server should map a small set of app identifiers to fixed executable paths, for example:

| Identifier | Example executable |
|---|---|
| `notepad` | `C:\Windows\System32\notepad.exe` |
| `vscode` | VS Code's installed `Code.exe` path |
| `chrome` | Chrome's installed `chrome.exe` path |

Actual paths must be checked on the target laptop. The server must return an error for an unknown identifier.

### 6.3 Process Launching

- Use `child_process.spawn` with a fixed executable path.
- Set `shell: false`.
- Do not interpolate user input into a command string.
- Return an appropriate response when the executable cannot be started.
- Avoid returning detailed filesystem paths or stack traces to the phone.

### 6.4 Server Binding

The development server may listen on port `3000` and bind to `0.0.0.0` to accept requests from the local network. This must be paired with Windows Firewall rules restricted to a trusted private network. Do not port-forward the service or expose it to the public internet.

## 7. API Specification

All endpoints require authentication in the MVP.

### 7.1 `GET /health`

**Purpose:** Check whether the server is reachable.

Successful response:

```json
{
  "online": true,
  "name": "DeskPilot"
}
```

### 7.2 `POST /launch/:name`

**Purpose:** Request launch of an allowlisted application.

Example path: `/launch/notepad`

Successful response:

```json
{
  "success": true,
  "app": "notepad"
}
```

### 7.3 Error Responses

| HTTP status | Meaning |
|---|---|
| `401 Unauthorized` | Token missing or invalid |
| `404 Not Found` | Unknown application identifier or route |
| `500 Internal Server Error` | Server or process launch failure |
| `503 Service Unavailable` | Optional response when the server cannot perform the action |

Responses should be concise and must not reveal secrets or unnecessary system details.

## 8. Configuration Requirements

The MVP requires the following configuration values:

| Setting | Location | Requirement |
|---|---|---|
| Port | Windows server | Default `3000`; configurable |
| Authentication token | Server and mobile client | Must match; use a long random value |
| Laptop IP address | Mobile client | Must match the laptop's current LAN IPv4 address |
| App executable paths | Windows server | Verify for each installed application |
| Firewall profile | Windows | Allow only the intended private-network access |

For the prototype, values may be stored in local configuration files. Before routine use, move server secrets to environment variables and improve how the mobile client stores credentials. A token embedded in a distributed APK can be extracted, so it should not be treated as strong device identity.

## 9. Network and Connectivity Requirements

- The phone and laptop must be able to reach each other over the same trusted local network.
- A phone hotspot may be used if the laptop can connect to it and client-to-client communication is allowed.
- Some hostel, guest or public Wi-Fi networks isolate devices. If requests fail despite correct IP and firewall settings, test on a trusted private network.
- Find the laptop IPv4 address using `ipconfig`.
- Confirm the server is running before using the mobile app.
- The MVP is local-network-only and does not require a cloud service.

## 10. Security Requirements

1. Require authentication for API requests.
2. Use an explicit application allowlist.
3. Launch fixed executable paths only.
4. Use `shell: false` when starting applications.
5. Reject unknown routes and app identifiers.
6. Restrict Windows Firewall access to the trusted private network.
7. Never expose the development port directly to the public internet.
8. Do not include secrets in logs, error messages, or repository commits.
9. Do not accept arbitrary command-line arguments from the phone in the MVP.
10. Consider HTTPS, secure pairing and improved credential storage before extending use beyond a trusted local prototype.

**HTTP note:** Plain HTTP on a trusted LAN is for the initial prototype only. It does not encrypt traffic. Do not use this design on untrusted networks or over the public internet.

## 11. Error Handling and Logging

The server should log operational events such as server startup, successful launch requests and launch failures, without logging authentication tokens.

The mobile app should display clear messages for:

- Laptop server unreachable.
- Request timed out.
- Authentication failed.
- Requested application not configured.
- Application failed to launch.
- Unexpected server response.

Logs should avoid passwords, tokens and personal data. Detailed stack traces should remain on the laptop during development.

## 12. Performance and Reliability

- Under normal local-network conditions, the server should acknowledge requests within approximately two seconds, excluding application startup time.
- Disable duplicate taps or show progress while a request is pending.
- The app must remain usable after a failed request and allow retry.
- The server should start with a clear console message and report configuration errors.
- The MVP does not require background operation on the phone.

## 13. Installation and Development Workflow

### 13.1 Windows Server

```bash
mkdir DeskPilotServer
cd DeskPilotServer
npm init -y
npm install express
```

Create `server.js`, configure the token and executable paths, then run:

```bash
node server.js
```

Verify the server locally and then from the phone. The implementation must match the API and security requirements in this document.

### 13.2 Expo Client

```bash
npx create-expo-app@latest DeskPilot --template blank
cd DeskPilot
npx expo start --lan
```

Install the app on a compatible Android device, configure the laptop IP and token, then test the health endpoint and one application launch.

### 13.3 Android APK

An APK can be built with EAS Build after the Expo project is configured. Confirm compatibility with the target Android version before relying on the APK for daily use.

## 14. Testing Requirements

| Test ID | Test | Expected result |
|---|---|---|
| T-01 | Start the Windows server | Server reports that it is listening |
| T-02 | Request `/health` with valid token | Online response returned |
| T-03 | Request endpoint with invalid token | Request rejected with `401` |
| T-04 | Launch Notepad from phone | Notepad opens on laptop |
| T-05 | Request unknown app identifier | Request rejected |
| T-06 | Stop server and check connection | App shows a connection error |
| T-07 | Configure a nonexistent executable | Useful launch error returned |
| T-08 | Test from a network that isolates clients | App reports connection failure; no false success |
| T-09 | Inspect server code for command injection | No arbitrary command execution; shell remains disabled |
| T-10 | Test on target Android phone | UI and network requests work on that device |

## 15. Constraints and Assumptions

- One phone and one Windows laptop are assumed for the MVP.
- The laptop is manually powered on and the DeskPilot server is running.
- The target Android phone has limited memory and may require an older compatible Expo setup.
- The laptop and phone have a mutually reachable local network.
- Installed application paths may vary by Windows user and installation method.
- Arduino and ESP8266 are not required for the first version.

## 16. Future Technical Work

Possible future additions include media controls, project-specific shortcuts, multi-app workflows, server status information and a pairing flow.

Remote power-on is not an MVP requirement. Wake-on-LAN depends on laptop firmware, network adapter, power state and network configuration. Any physical power-button interface must be researched for the exact laptop model and electrically isolated; never connect a microcontroller directly to mains or charger circuitry.

## 17. Definition of Done

The MVP is considered technically complete when:

- The server runs on the target Windows laptop.
- The phone can authenticate and reach the server.
- The health check reports the correct status.
- At least one allowlisted application launches successfully from the phone.
- Invalid credentials and unknown app identifiers are rejected.
- Connection and launch failures are handled clearly.
- The project is documented and the app has been tested on the intended Android device.

---

**DeskPilot tagline:** *Your phone. Your laptop. One tap away.*
