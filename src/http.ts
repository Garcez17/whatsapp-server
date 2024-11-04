import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path, { join } from 'path';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

const server = createServer(app);

mongoose.connect('mongodb://localhost/wppggz');

// app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "https://rps-master.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', socket => {
});

export { server, io };