import { config } from "dotenv";
import { Channel, connect } from "amqplib";

config()

export const createMessageChannel = async (): Promise<Channel | null> => {
  try {
    const connection = await connect(`${process.env.AMQP_SERVER}`)
    const channel = await connection.createChannel()
    await channel.assertQueue(`${process.env.QUEUE_NAME}`)
    console.log("Connected to RabbitMQ")

    return channel
  } catch (error) {
    console.log(error)
    return null
  }
}