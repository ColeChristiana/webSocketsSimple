import { createServer as createHttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from './shared';

const corsParams = {
    origin: "http://localhost:8080",  // Updated to match client port
    methods: ["GET", "POST"]
}

export default function createServer() {
    const httpServer = createHttpServer();
    const io = new Server
        <ClientToServerEvents, ServerToClientEvents>
        (httpServer, { cors: corsParams });

    const clientConnections = new Map<string, Socket<ClientToServerEvents, ServerToClientEvents>>();

    io.on("connection", (socket) => {
        console.log('server reports new connection')
        startServerHandlers(socket, clientConnections)       
    })

    console.log('server.ts: Listening on port 8080')
    httpServer.listen(8080);

}

function startServerHandlers(socket: Socket<ClientToServerEvents, ServerToClientEvents>, clientConnections: Map<string, Socket<ClientToServerEvents, ServerToClientEvents>>) {
    
    socket.on('hello', (clientName: string) => {
        clientConnections.set(clientName, socket);
        console.log(`Client ${clientName} connected. Total clients: ${clientConnections.size}`);
        console.log('sending initial ping')
        socket.emit('ping', 0); // send initial ping
    })

    socket.on('pong', (clientName: string, count: number) => {
        console.log(`server received pong from ${clientName} with count ${count}`);
        if (count < 5) {
           socket.emit('ping', count + 1); // reply with ping n+1
        } else {
            console.log(`server disconnecting ${clientName} after 5 pings`);
            socket.disconnect();
        }
    })
    
    socket.on('goodbye', (clientName: string) => {
        console.log(`server received goodbye from ${clientName}`);
    });

    socket.on('disconnect', () => {
        // Find the client name by searching for this socket in clientConnections
        let disconnectedClientName: string | undefined;
        for (const [clientName, clientSocket] of clientConnections.entries()) {
            if (clientSocket === socket) {
                disconnectedClientName = clientName;
                break;
            }
        }

        if (disconnectedClientName) {
            clientConnections.delete(disconnectedClientName);
            console.log(`Client ${disconnectedClientName} disconnected. Total clients: ${clientConnections.size}`);
        }
    });
}











