# DeskPilot — Product Requirements Document (PRD)

**Project Name:** DeskPilot  
**Project Type:** Personal Software Project  
**Version:** 1.0  
**Status:** Planning / MVP Development

## 1. Project Overview

DeskPilot is a lightweight wireless laptop controller that transforms an old Android smartphone into a dedicated control panel for a Windows laptop.

Users can tap buttons on their phone to launch applications such as Visual Studio Code, Google Chrome, and Notepad on their laptop through a local Wi-Fi connection.

The project uses **React Native with Expo** for the Android application and **Node.js with Express.js** for the Windows-side server.

## 2. Problem Statement

Opening frequently used applications on a laptop requires manually switching to the laptop and locating each application.

DeskPilot aims to simplify this process by allowing users to launch their preferred applications directly from an old smartphone.

## 3. Project Objectives

- Repurpose an unused Android phone into a useful productivity device.
- Launch Windows applications with a single tap.
- Enable wireless communication over a local network.
- Provide a simple and lightweight user interface.
- Authenticate requests and restrict access to approved applications.
- Build a modular foundation for future laptop-control features.

## 4. Target Users

- Developers who frequently open coding tools.
- Students who want a dedicated desk controller.
- Users who have an unused Android smartphone.
- People interested in automation and personal productivity.

## 5. Key Features

### MVP Features

- **Application Launcher:** Open configured applications such as VS Code, Chrome, and Notepad.
- **Wireless Communication:** Connect the Android app to the Windows server over local Wi-Fi.
- **Connection Status:** Check whether the laptop server is reachable.
- **One-Tap Controls:** Launch applications through dedicated buttons.
- **Authentication:** Reject requests without valid credentials.
- **Error Handling:** Display useful messages when the laptop is offline or an action fails.
- **Custom Application Paths:** Configure executable paths on the laptop.

### Future Features

- Custom application shortcuts.
- Multi-application workflows.
- Project and workspace shortcuts.
- Media playback controls.
- Laptop status monitoring.
- Wake-on-LAN support where compatible.
- Optional hardware-assisted power control after hardware verification.

## 6. Technology Stack

| Component | Technology |
|---|---|
| Android Application | React Native |
| Mobile Framework | Expo |
| Laptop Backend | Node.js |
| Backend Framework | Express.js |
| Communication | HTTP over local network |
| Target Mobile OS | Android |
| Target Desktop OS | Windows |
| Optional Hardware | ESP8266 / Arduino |

## 7. System Architecture

```text
+-----------------------------+
|     Android Phone           |
|  React Native + Expo        |
|                             |
|  [VS Code] [Chrome]         |
|  [Notepad] [Connection]     |
+--------------+--------------+
               |
               | Local Wi-Fi
               | Authenticated HTTP
               v
+-----------------------------+
|      Windows Laptop         |
|                             |
|  Node.js + Express Server   |
|              |              |
|       Authentication        |
|              |              |
|       App Allowlist         |
|              |              |
|              v              |
|  Launch Approved Programs   |
+-----------------------------+
```

## 8. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The app must check the laptop server connection. |
| FR-02 | The home screen must display configured application buttons. |
| FR-03 | Tapping an application button must send a launch request. |
| FR-04 | The server must launch only allowlisted applications. |
| FR-05 | The server must authenticate incoming requests. |
| FR-06 | The app must display connection and action status. |
| FR-07 | The system must handle network and application launch errors. |
| FR-08 | The laptop IP address and application paths must be configurable. |

## 9. Non-Functional Requirements

- **Performance:** Respond quickly over a healthy local network.
- **Compatibility:** Support the target Windows laptop and compatible Android device.
- **Usability:** Keep the interface simple and easy to operate.
- **Security:** Never execute arbitrary commands received from the phone.
- **Privacy:** No cloud account or cloud data collection is required for the MVP.
- **Maintainability:** Keep the mobile application and laptop server as separate modules.

## 10. API Requirements

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check server availability |
| POST | `/launch/:name` | Launch an approved application |

**Default development port:** `3000`

All endpoints must require authentication. Unknown application names must be rejected.

## 11. Project Scope

### In Scope

- Android application interface.
- Windows-side server.
- Local Wi-Fi communication.
- Application launching.
- Connection monitoring.
- Authentication and basic error handling.

### Out of Scope for MVP

- Turning on a fully shut-down laptop.
- Public internet access.
- Cloud-based remote control.
- Full remote desktop streaming.
- Arbitrary shell or terminal command execution.

**Important:** The laptop must already be powered on and the DeskPilot server must be running for the MVP to work.

## 12. Acceptance Criteria

- [ ] The Windows server starts successfully.
- [ ] The Android app can connect to the server.
- [ ] The connection status is displayed correctly.
- [ ] Tapping the Notepad button opens Notepad.
- [ ] Configured applications launch successfully.
- [ ] Invalid authentication is rejected.
- [ ] Unknown application identifiers are rejected.
- [ ] Network failures produce understandable messages.
- [ ] The application works without a cloud service on a compatible local network.

## 13. Development Milestones

1. **Server Setup:** Create the Node.js and Express.js backend.
2. **API Development:** Implement the health-check and application-launch endpoints.
3. **Mobile UI:** Create the Expo application and launcher buttons.
4. **Network Integration:** Connect the phone and laptop.
5. **Testing:** Verify application launching, authentication, and error handling.
6. **APK Build:** Generate and install an Android APK.
7. **Future Enhancements:** Explore workflows, media controls, and compatible wake features.

## 14. Security Considerations

- Use a strong authentication token during development.
- Restrict the server to a trusted local network.
- Configure Windows Firewall to allow access only on the appropriate private network.
- Use an application allowlist and fixed executable paths.
- Avoid exposing the development server to the public internet.
- Improve credential storage and device pairing before regular use.

## 15. Future Scope

DeskPilot can evolve into a personal productivity control system with customizable shortcuts, development workflows, media controls, and laptop status monitoring.

Wake-on-LAN or hardware-assisted power control may be explored separately, depending on laptop compatibility and safe electrical design.

## 16. Expected Outcome

The final MVP will allow a user to repurpose an old Android phone as a wireless application launcher for a Windows laptop, reducing repetitive interactions and providing a foundation for future desktop automation.

## Tagline

**Your phone. Your laptop. One tap away.**
