## Summary of Changes

Interface changes (shared.ts)

- Added `hello` to ClientToServerEvents interface in shared.ts

Server changes (server.ts)

- Added `clientConnections` Map in `createServer()` to track client names and sockets
- Updated `startServerHandlers()` to accept the the `clientConnections` parameter
- Removed immediate ping send from `startServerHandlers()`
- Added socket.on('hello', ...) handler to add clients to Map, log connection, and send initial ping
- Added socket.on('disconnect', ...) handler to find disconnected client by socket, remove from Map, and log disconnection

Client changes (client.ts)

- Added `socket.emit('hello', clientName)` in the `connect` event handler to send hello message with client name
