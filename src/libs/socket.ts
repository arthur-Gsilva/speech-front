import { io } from "socket.io-client";
// const socket = io("https://speech-socket.onrender.com");
const socket = io("http://localhost:3001");
export default socket;
