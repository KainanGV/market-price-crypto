import { config } from "dotenv"
import { connect } from "mongoose"

config()

export const connectToMongoD = async () => {
  await connect(`${process.env.MONGODB_SERVER}`)
}