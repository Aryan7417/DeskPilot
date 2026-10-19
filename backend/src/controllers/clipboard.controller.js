// const { spawn } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const crypto = require("crypto");

// const clipboardFile = path.join(__dirname, "../../data/clipboard.json");
// const MAX_ITEMS = 50;
// const MAX_TEXT_LENGTH = 20000;

// function ensureClipboardFile() {
//   fs.mkdirSync(path.dirname(clipboardFile), { recursive: true });
//   if (!fs.existsSync(clipboardFile)) {
//     fs.writeFileSync(clipboardFile, "[]", "utf8");
//   }
// }

// function readClipboard() {
//   ensureClipboardFile();

//   try {
//     const data = JSON.parse(fs.readFileSync(clipboardFile, "utf8"));
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error("Clipboard history read error:", error.message);
//     return [];
//   }
// }

// function saveClipboard(items) {
//   ensureClipboardFile();
//   fs.writeFileSync(clipboardFile, JSON.stringify(items.slice(0, MAX_ITEMS), null, 2), "utf8");
// }

// function addClipboardText(text) {
//   if (typeof text !== "string") return;
//   const cleanText = text.slice(0, MAX_TEXT_LENGTH);

//   if (!cleanText.trim()) return;

//   const items = readClipboard();

//   // Avoid repeatedly saving the same clipboard contents.
//   if (items.length > 0 && items[0].text === cleanText) return;

//   const item = {
//     id: crypto.randomUUID(),
//     text: cleanText,
//     createdAt: new Date().toISOString(),
//     source: "Laptop",
//   };

//   saveClipboard([item, ...items].slice(0, MAX_ITEMS));
//   console.log("Clipboard text captured:", cleanText.length, "characters");
// }

// let monitorProcess = null;
// let monitorStarted = false;

// function startClipboardMonitor() {
//   if (monitorStarted) return;
//   monitorStarted = true;

//   if (process.platform !== "win32") {
//     console.warn("Clipboard monitor is Windows-only; it was not started.");
//     return;
//   }

//   // Windows Forms clipboard access requires an STA PowerShell process.
//   // Only non-empty text is captured; image/file clipboard contents are ignored.
//   const script = `
//     Add-Type -AssemblyName System.Windows.Forms
//     $last = [string]::Empty
//     while ($true) {
//       try {
//         $current = [System.Windows.Forms.Clipboard]::GetText()
//         if ($null -ne $current -and $current.Length -gt 0 -and $current -ne $last) {
//           $bytes = [System.Text.Encoding]::UTF8.GetBytes($current)
//           [Console]::Out.WriteLine([Convert]::ToBase64String($bytes))
//           $last = $current
//         }
//       } catch {
//         # Clipboard can be temporarily busy or unavailable; retry next loop.
//       }
//       Start-Sleep -Milliseconds 800
//     }
//   `;

//   monitorProcess = spawn(
//     "powershell.exe",
//     ["-NoLogo", "-NoProfile", "-NonInteractive", "-STA", "-Command", script],
//     {
//       windowsHide: true,
//       stdio: ["ignore", "pipe", "pipe"],
//     }
//   );

//   let stdoutBuffer = "";

//   monitorProcess.stdout.setEncoding("utf8");
//   monitorProcess.stdout.on("data", (chunk) => {
//     stdoutBuffer += chunk;
//     const lines = stdoutBuffer.split(/\r?\n/);
//     stdoutBuffer = lines.pop() || "";

//     for (const line of lines) {
//       const encoded = line.trim();
//       if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) continue;

//       try {
//         const text = Buffer.from(encoded, "base64").toString("utf8");
//         addClipboardText(text);
//       } catch (error) {
//         console.error("Could not decode clipboard text:", error.message);
//       }
//     }
//   });

//   monitorProcess.stderr.setEncoding("utf8");
//   monitorProcess.stderr.on("data", (chunk) => {
//     const message = chunk.trim();
//     if (message) console.warn("Clipboard monitor:", message);
//   });

//   monitorProcess.on("error", (error) => {
//     console.error("Could not start clipboard monitor:", error.message);
//     monitorStarted = false;
//   });

//   monitorProcess.on("exit", (code) => {
//     console.warn(`Clipboard monitor exited with code ${code}`);
//     monitorProcess = null;
//     monitorStarted = false;
//   });

//   console.log("Windows clipboard monitor started (text only).");
// }

// function getClipboard(req, res) {
//   try {
//     return res.json({ success: true, items: readClipboard() });
//   } catch (error) {
//     console.error("Get clipboard error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not read clipboard history",
//     });
//   }
// }

// function deleteClipboardItem(req, res) {
//   try {
//     const items = readClipboard();
//     const index = items.findIndex((item) => item.id === req.params.id);

//     if (index === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Clipboard item not found",
//       });
//     }

//     const [deleted] = items.splice(index, 1);
//     saveClipboard(items);

//     return res.json({
//       success: true,
//       message: "Clipboard item deleted",
//       id: deleted.id,
//     });
//   } catch (error) {
//     console.error("Delete clipboard error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not delete clipboard item",
//     });
//   }
// }

// module.exports = {
//   startClipboardMonitor,
//   getClipboard,
//   deleteClipboardItem,
// };




const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const clipboardFile = path.join(__dirname, "../../data/clipboard.json");
const MAX_ITEMS = 50;
const MAX_TEXT_LENGTH = 20000;

function ensureClipboardFile() {
  fs.mkdirSync(path.dirname(clipboardFile), { recursive: true });

  if (!fs.existsSync(clipboardFile)) {
    fs.writeFileSync(clipboardFile, "[]", "utf8");
  }
}

function readClipboard() {
  ensureClipboardFile();

  try {
    const data = JSON.parse(fs.readFileSync(clipboardFile, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Clipboard history read error:", error.message);
    return [];
  }
}

function saveClipboard(items) {
  ensureClipboardFile();
  fs.writeFileSync(
    clipboardFile,
    JSON.stringify(items.slice(0, MAX_ITEMS), null, 2),
    "utf8"
  );
}

function addClipboardText(text) {
  if (typeof text !== "string") return;

  const cleanText = text.slice(0, MAX_TEXT_LENGTH);
  if (!cleanText.trim()) return;

  const items = readClipboard();

  if (items.length > 0 && items[0].text === cleanText) return;

  const item = {
    id: crypto.randomUUID(),
    text: cleanText,
    createdAt: new Date().toISOString(),
    source: "Laptop",
  };

  saveClipboard([item, ...items].slice(0, MAX_ITEMS));
  console.log("Clipboard text captured:", cleanText.length, "characters");
}

let monitorProcess = null;
let monitorStarted = false;

function startClipboardMonitor() {
  if (monitorStarted) return;
  monitorStarted = true;

  if (process.platform !== "win32") {
    console.warn("Clipboard monitor is Windows-only; it was not started.");
    return;
  }

  const script = `
    Add-Type -AssemblyName System.Windows.Forms
    $last = [string]::Empty
    while ($true) {
      try {
        $current = [System.Windows.Forms.Clipboard]::GetText()
        if ($null -ne $current -and $current.Length -gt 0 -and $current -ne $last) {
          $bytes = [System.Text.Encoding]::UTF8.GetBytes($current)
          [Console]::Out.WriteLine([Convert]::ToBase64String($bytes))
          $last = $current
        }
      } catch {}
      Start-Sleep -Milliseconds 800
    }
  `;

  monitorProcess = spawn(
    "powershell.exe",
    ["-NoLogo", "-NoProfile", "-NonInteractive", "-STA", "-Command", script],
    {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let stdoutBuffer = "";

  monitorProcess.stdout.setEncoding("utf8");
  monitorProcess.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    const lines = stdoutBuffer.split(/\r?\n/);
    stdoutBuffer = lines.pop() || "";

    for (const line of lines) {
      const encoded = line.trim();
      if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) continue;

      try {
        addClipboardText(Buffer.from(encoded, "base64").toString("utf8"));
      } catch (error) {
        console.error("Could not decode clipboard text:", error.message);
      }
    }
  });

  monitorProcess.stderr.setEncoding("utf8");
  monitorProcess.stderr.on("data", (chunk) => {
    const message = chunk.trim();
    if (message) console.warn("Clipboard monitor:", message);
  });

  monitorProcess.on("error", (error) => {
    console.error("Could not start clipboard monitor:", error.message);
    monitorStarted = false;
  });

  monitorProcess.on("exit", (code) => {
    console.warn(`Clipboard monitor exited with code ${code}`);
    monitorProcess = null;
    monitorStarted = false;
  });

  console.log("Windows clipboard monitor started (text only).");
}

function getClipboard(req, res) {
  try {
    return res.json({
      success: true,
      items: readClipboard(),
    });
  } catch (error) {
    console.error("Get clipboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not read clipboard history",
    });
  }
}

function deleteClipboardItem(req, res) {
  try {
    const items = readClipboard();
    const index = items.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Clipboard item not found",
      });
    }

    const [deleted] = items.splice(index, 1);
    saveClipboard(items);

    return res.json({
      success: true,
      message: "Clipboard item deleted",
      id: deleted.id,
    });
  } catch (error) {
    console.error("Delete clipboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not delete clipboard item",
    });
  }
}

// NEW: Delete all clipboard history
function deleteAllClipboard(req, res) {
  try {
    const items = readClipboard();
    const deletedCount = items.length;

    saveClipboard([]);

    return res.json({
      success: true,
      message: "All clipboard history deleted",
      deletedCount,
      items: [],
    });
  } catch (error) {
    console.error("Delete all clipboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not delete clipboard history",
    });
  }
}

module.exports = {
  startClipboardMonitor,
  getClipboard,
  deleteClipboardItem,
  deleteAllClipboard,
};
