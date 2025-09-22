import createServer from "./server";
import Client from "./client";

const server = createServer();
// 
// 
const client1 = new Client("A");  // client listens on server events
const client2 = new Client("B");
