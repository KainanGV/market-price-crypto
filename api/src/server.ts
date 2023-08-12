import { connection } from "mongoose";
import { fastify } from "./app";
import { connectToMongoD } from "./config/db";
import CandleMessageChannel from "./messages/CandleMessageChannel";
import fastifyIO from "fastify-socket.io";

const createServer = async() => {
  await connectToMongoD()

  const candleMsgChannel = new CandleMessageChannel(fastify)

  const server = fastify.register(fastifyIO)

  await server.ready()

  // we need to wait for the server to be ready, else `server.io` is undefined
  server.io.on("connection", (socket) => {
    console.log("Web socket connection created")
  });

  await fastify.listen({ port: Number(process.env.PORT) })

  const candle = await candleMsgChannel.consumeMessages()

  server.io.emit(`${process.env.SOCKET_EVENT_NAME}`, candle)

  process.on("SIGINT", async () => {
    await connection.close()
    fastify.close()

    console.log("close connections")
  })
}

createServer()

