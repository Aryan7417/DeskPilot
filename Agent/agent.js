require("dotenv").config();
const Server_URL = process.env.DESKPILOT_SERVER_URL;

if (!Server_URL) {
    console.error("Desktop_server_URL missing in .env")
    process.exit(1);
}





console.log("DeskPilot Windows Agent starting...");
console.log("Backend:", Server_URL);
console.log("Agent is ready for backend integration.");