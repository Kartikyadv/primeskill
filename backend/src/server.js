import app from './app.js';
import { createServer } from 'http';
import initializeSocket from './config/socket.js';

const PORT = process.env.PORT || 5000;

const server = createServer(app);

export const io = initializeSocket(server);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
