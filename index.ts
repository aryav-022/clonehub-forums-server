import type { Express } from "express";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type { Message } from "@prisma/client";
import { db } from "./lib/db";
import "dotenv/config";

const app: Express = express();

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	// Get the user id from the query - this will act as a static id
	const { id } = socket.handshake.query;

	// Join the room with the user id
	socket.join(id as string);

	socket.on("message", async (message: Message, acknowledge: (message: Message) => void) => {
		try {
			// Save message to database
			const savedMessage = await db.message.create({
				data: {
					createdAt: message.createdAt,
					fromId: message.fromId,
					toId: message.toId,
					content: message.content,
				},
			});

			acknowledge(savedMessage);

			socket.broadcast.to(message.toId).emit("message", savedMessage);
		} catch (error) {
			console.error(error);
		}
	});
});

server.listen(8000, () => {
	console.log("Server is running on http://localhost:8000");
});
