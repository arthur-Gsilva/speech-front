import { io } from "socket.io-client";
const socket = io("https://speech-socket.onrender.com");
export default socket;
