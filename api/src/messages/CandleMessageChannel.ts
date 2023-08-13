import { Channel, Message, connect } from "amqplib";
import CreateCandleController from "../controllers/CreateCandleController";
import { Server } from "socket.io";
import * as http from "http"
import { Candle } from "../models/CandleModel";
import {FastifyInstance} from "fastify"


export default class CandleMessageChannel {
  private _channel!: Channel
  private _createCandleCtrl!: CreateCandleController
  private _io!: any

  constructor(server: FastifyInstance) {
    this._createCandleCtrl = new CreateCandleController()
    // this._io = new Server(server as unknown as http.Server, {
    //   cors: {
    //     origin: `${process.env.SOCKET_CLIENT_SERVER}`,
    //     methods: ["GET", "POST"]
    //   }
    // })

    // this._io = server.register(fastifyIO)

    // server.ready().then(() => {
    //   // we need to wait for the server to be ready, else `server.io` is undefined
    //   server.io.on("connection", (socket) => {
    //     console.log("Web socket connection created")
    //   });
    // });
  }

  private async _createMessageChannel() {
    console.log()
    try {
      const connection = await connect(`${process.env.AMQP_SERVER}`)
      this._channel = await connection.createChannel()
      this._channel.assertQueue(`${process.env.QUEUE_NAME}`)
    } catch (error) {
      console.log(error)
    }
  }

  async consumeMessages() {
    await this._createMessageChannel()

    if(this._channel) {
      this._channel.consume(`${process.env.QUEUE_NAME}`, async msg => {
        const candleData = JSON.parse(msg?.content.toString() as string)
        console.log("Message received", candleData)
  
        this._channel.ack(msg as Message)
  
        const candle: Candle = candleData
        await this._createCandleCtrl.handle(candle)
  
        console.log("Candle saved to database")
        // this._io.emit(`${process.env.SOCKET_EVENT_NAME}`, candle)
        // console.log("New candle emited by socket web")

        return candle
      })
    }
  }

}