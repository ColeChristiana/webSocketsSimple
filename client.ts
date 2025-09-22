import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './shared';

const clientURL = "http://localhost:8080"; // Ensure this matches the server URL

export default class Client {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> 
        = io(clientURL)
    private clientName: string;

    constructor(clientName: string) {
        this.clientName = clientName;
        console.log(clientName, `connecting to`, clientURL);
        startClientHandlers(this.socket, this.clientName);
        console.log(`${this.clientName} event handlers started`);
    }  
}

function startClientHandlers(
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    clientName: string
) {

    // system starts by sending 'connect'
    socket.on('connect', () => {
        console.log(`${clientName} connected to server on ${clientURL}`);
        socket.emit('hello', clientName); // send hello message after connecting w/ client name
    });

    socket.on('ping', (n: number) => {
        console.log(`${clientName} received ping with count ${n}`);
        if (n <= 5) {
            socket.emit('pong', clientName, n); // reply with pong
        } else {
            console.log(`${clientName} received ping with count ${n} > 5, this shouldn't happen`);
            socket.disconnect(); // disconnect if count exceeds 5
        }
    });

    // Handle SIGINT (Ctrl+C) gracefully
    process.on('SIGINT', () => {
        console.log(`\n${clientName} received SIGINT, shutting down...`);
        socket.emit('goodbye', clientName); // notify server before disconnecting   
        socket.disconnect();
        process.exit(0);
    });

}
    
        
    

