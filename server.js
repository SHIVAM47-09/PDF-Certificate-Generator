import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import router from './routers/index.js';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(router)

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});