"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const db_1 = require("./lib/db");
require("dotenv/config");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    // Get the user id from the query - this will act as a static id
    const { id } = socket.handshake.query;
    // Join the room with the user id
    socket.join(id);
    socket.on("message", (message, acknowledge) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Save message to database
            const savedMessage = yield db_1.db.message.create({
                data: {
                    createdAt: message.createdAt,
                    fromId: message.fromId,
                    toId: message.toId,
                    content: message.content,
                },
            });
            acknowledge(savedMessage);
            socket.broadcast.to(message.toId).emit("message", savedMessage);
        }
        catch (error) {
            console.error(error);
        }
    }));
});
server.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
