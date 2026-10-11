# DeskPilot — Lightweight Wireless Laptop Controller

## Project Description

DeskPilot is a lightweight Android application that transforms an old Android smartphone into a wireless control panel for a Windows laptop. It allows users to launch desktop applications such as Visual Studio Code, Google Chrome, Notepad, and other configured programs with a single tap.

The application communicates with a Node.js and Express backend running on the laptop over a local Wi-Fi network. When a user selects an application on the phone, the backend securely verifies the request and launches the corresponding application on the laptop.

DeskPilot is designed to work efficiently on older Android devices with limited RAM and storage. Its minimal interface focuses on fast response times, simple navigation, and practical everyday use without requiring additional hardware.

## Key Features

- **One-Tap Application Launcher:** Open frequently used desktop applications directly from the phone.
- **Wireless Communication:** Control the laptop over a shared local Wi-Fi network.
- **Lightweight Android App:** Designed for older smartphones with limited hardware resources.
- **Custom Shortcuts:** Configure frequently used applications and development tools.
- **Connection Monitoring:** Check whether the laptop's control server is reachable.
- **Secure Command Handling:** Use authentication and predefined application commands to restrict unauthorized actions.
- **Future Power Automation:** Explore Wake-on-LAN or compatible hardware-based power-button control.

## Technology Stack

- **Mobile Application:** React Native with Expo
- **Backend:** Node.js and Express.js
- **Communication:** HTTP over a local network
- **Target Platform:** Android and Windows
- **Optional Hardware Extension:** ESP8266 or Arduino for compatible power-control experiments

## Project Objective

The primary objective of DeskPilot is to repurpose an old smartphone into a dedicated laptop controller, reducing the need to repeatedly interact with the laptop directly. The project combines mobile application development, backend programming, networking, and basic system automation in a practical personal productivity tool.

## Future Scope

Future versions may include media playback controls, custom multi-application workflows, project-specific shortcuts, system status monitoring, and remote startup functionality where supported by the laptop hardware.

**Project tagline:** *Your phone. Your laptop. One tap away.*