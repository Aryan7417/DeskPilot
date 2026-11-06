# DeskPilot

DeskPilot is a remote Windows laptop controller built with an Expo React
Native mobile app, a Node.js/Express backend, and a separate Windows
Agent.

> **Project status:** Development/testing. The backend is deployed on
> Render. The Windows Agent must be running on the target laptop for
> laptop-side actions such as launching applications and clipboard
> monitoring.

## Features

-   Remote launch requests for saved Windows applications.
-   Saved application list managed through the backend.
-   Windows clipboard monitoring and upload through the Agent.
-   Agent heartbeat/status flow (requires the corresponding backend
    routes to be deployed).
-   Mobile dashboard with app launch, connection, activity, and settings
    screens.

## Architecture

``` text
Android phone (Expo React Native)
              |
              | HTTPS API requests
              v
Node.js / Express backend (Render)
              ^
              | HTTPS polling, heartbeat,
              | command results, clipboard text
              |
Windows Agent (Node.js on laptop)
              |
              v
Windows applications / clipboard
```

The backend and Agent are different: - The backend stores app data and
queues commands. - The Windows Agent runs on the laptop and performs
desktop actions. - The mobile app is the interface used to manage and
launch saved apps.

**Important:** `GET /health` confirms that the backend is reachable. It
does not confirm that the Windows Agent is online. The Agent's actual
status requires the heartbeat/status endpoints.

## Technology stack

  Component              Technology
  ---------------------- ---------------------------------------------
  Mobile                 React Native, Expo, Expo Router, TypeScript
  Backend                Node.js, Express
  Windows Agent          Node.js, child_process, PowerShell
  Deployment/build       Render, Expo EAS Build
  Current data storage   JSON files

## Project structure

Representative structure based on the project files shared during
development:

``` text
DeskPilot/
├── Backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── app.routes.js
│   │   │   ├── clipboard.routes.js
│   │   │   └── agent.routes.js
│   │   ├── controllers/
│   │   │   ├── app.controller.js
│   │   │   ├── clipboard.controller.js
│   │   │   └── agent.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── agentAuth.js
│   │   └── utils/
│   │       └── agentQueur.js
│   ├── data/
│   │   ├── apps.json
│   │   └── clipboard.json
│   └── public/
│       └── app-icons/
├── Mobile/
│   └── src/
│       ├── app/
│       │   ├── (tabs)/
│       │   ├── connection.tsx
│       │   └── apps/
│       ├── components/
│       └── services/
└── agent/
    ├── agent.js
    └── .env
```

Folder names may differ slightly as development continues.

## Requirements

-   Node.js and npm.
-   Windows 10/11 for the Agent.
-   PowerShell for clipboard monitoring.
-   Expo account for EAS cloud builds.
-   Android phone for APK testing.

## Backend setup

``` bash
cd Backend
npm install
```

Create a `.env` file with the environment variables required by the
backend:

``` env
PORT=3000
DESKPILOT_AGENT_TOKEN=replace_with_a_long_random_secret
```

Start the backend using the start script configured in `package.json`.

Deployed backend used during development:

``` text
https://deskpilot-259y.onrender.com
```

Health endpoint:

``` text
GET /health
```

Do not commit `.env` files or secrets to Git.

## Windows Agent setup

``` bash
cd agent
npm install
```

Create `agent/.env`:

``` env
DESKPILOT_SERVER_URL=https://deskpilot-259y.onrender.com
DESKPILOT_AGENT_TOKEN=the_same_secret_configured_on_the_backend
```

The Agent token must match the backend's `DESKPILOT_AGENT_TOKEN`.

Start the Agent on the Windows laptop:

``` bash
node agent.js
```

Keep it running in the logged-in Windows desktop session. If the Agent
stops, remote app launching and clipboard monitoring from that Agent
stop.

### Agent responsibilities

-   Polls the backend for pending commands.
-   Resolves supported app names to local executable paths.
-   Starts the executable on Windows.
-   Reports command results to the backend.
-   Monitors clipboard text through PowerShell and uploads new text.
-   Sends periodic heartbeats when the heartbeat endpoint is configured.

The current automatic executable lookup includes common paths for VLC,
Visual Studio Code, Microsoft Edge, Brave, and Notepad. Other
applications require additional local path configuration.

## Mobile app setup

``` bash
cd Mobile
npm install
npx expo install --fix
npx expo start
```

Ensure the mobile app's API base URL points to:

``` text
https://deskpilot-259y.onrender.com
```

Do not use `localhost` as the API host in an APK installed on a phone;
on the phone, `localhost` refers to the phone itself.

## Build an Android APK

From the `Mobile` directory:

``` bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
```

Add or merge this preview profile in `eas.json` (preserve any existing
profiles):

``` json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Build the APK:

``` bash
npx eas-cli@latest build --platform android --profile preview
```

Download the APK from the EAS build page and install it on the Android
phone.

## API overview

Routes shared during development:

  ----------------------------------------------------------------------------------
  Method                  Endpoint                           Purpose
  ----------------------- ---------------------------------- -----------------------
  GET                     `/health`                          Backend health check

  GET                     `/api/apps`                        Get saved apps

  POST                    `/api/apps`                        Add an app

  POST                    `/api/apps/:id/launch`             Queue an app launch

  DELETE                  `/api/apps/:id`                    Delete a saved app

  GET                     `/api/clipboard`                   Get clipboard history

  POST                    `/api/clipboard`                   Receive clipboard text
                                                             from Agent

  DELETE                  `/api/clipboard`                   Delete clipboard
                                                             history

  DELETE                  `/api/clipboard/:id`               Delete one clipboard
                                                             item

  GET                     `/api/agent/commands/next`         Agent polls for the
                                                             next command

  POST                    `/api/agent/commands/:id/result`   Agent reports command
                                                             result

  POST                    `/api/agent/heartbeat`             Agent heartbeat, if
                                                             configured

  GET                     `/api/agent/status`                Agent status, if
                                                             configured
  ----------------------------------------------------------------------------------

App routes use the app authentication middleware. Agent command and
clipboard routes use Agent authentication where configured. The
heartbeat and status routes must exist in the deployed backend for those
endpoints to work. A 404 means the requested route is not available at
that deployed URL.

## Connection status

DeskPilot has two separate connection states:

1.  **Backend reachable:** The mobile app can reach Render's `/health`
    endpoint.
2.  **Windows Agent online:** The Agent is running and sending
    heartbeats.

Do not use `/health` as proof that the Windows laptop Agent is online.
The dashboard should use the Agent status endpoint for the actual laptop
online/offline indicator. App records can be fetched from the backend
independently, but launching them requires the Windows Agent to be
running.

## Troubleshooting

### Dashboard and Connection screen show different statuses

-   Ensure both screens use the intended status source.
-   `/health` checks the backend only.
-   `/api/agent/status` checks the Agent only and requires the
    heartbeat/status route to be deployed.
-   Confirm `node agent.js` is running on Windows.

### HTTP 404 for `/api/agent/status`

The deployed backend may not expose that route, or the route path/mount
may differ. Check `agent.routes.js`, the controller exports, the route
mount in `server.js`, and the Render deployment.

### JSON parse error or response begins with `<`

The app expected JSON but received HTML. Check the URL, route, HTTP
status, and deployed backend version. During debugging, read the
response as text to inspect the actual response.

### Agent authentication fails

-   Confirm `DESKPILOT_AGENT_TOKEN` exists in the Agent `.env` and
    Render environment variables.
-   Ensure both values match.
-   Restart the Agent after changing its `.env`.

### Clipboard upload fails

-   The clipboard monitor runs on Windows, not on the Render Linux
    server.
-   Keep the Agent running in the logged-in Windows desktop session.
-   Confirm the backend clipboard route accepts the Agent-authenticated
    POST request.

### App icon does not load

-   Confirm `iconUrl` points to a publicly reachable image on the
    deployed backend.
-   A `localhost` URL will not work on another device.
-   Confirm the icon file is included in the deployed backend.

## Security notes

-   Never commit `.env` files, API tokens, or private credentials.
-   Use a long, random Agent token.
-   Keep Agent-only endpoints protected by Agent authentication.
-   Clipboard sync can transmit copied text to the backend; avoid
    copying sensitive content while sync is enabled.
-   Restrict which applications can be launched remotely.

## Current limitations

-   The Windows Agent must be running for laptop-side actions.
-   Automatic app path detection only supports applications configured
    in its lookup table.
-   JSON-file storage is suitable for the current prototype; evaluate
    persistent production storage before wider deployment.
-   Agent heartbeat/status depends on the corresponding backend routes
    being deployed.
-   Backend uptime does not mean the Windows Agent is online.

## License

No license has been specified yet. Add a `LICENSE` file before
distributing the project as open source.
