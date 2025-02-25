import { io } from "socket.io-client";

// Ambil URL dari environment variable
const socket = io(process.env.REACT_APP_SOCKET_URL);
//console.log("test",process.env.REACT_APP_SOCKET_URL)
export default socket;
