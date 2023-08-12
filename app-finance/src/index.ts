import { config } from "dotenv"
import { Period } from "./enums/Period";
import Candle from "./models/Candle";
import { createMessageChannel } from "./messages/messageChannel";

config()

const readMarketPrice = async (): Promise<number> => {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  const options = {
    method: "GET",
    headers: myHeaders
  }

  const data = await fetch(`${process.env.BITCOIN_PRICES}`, options).then(response => response.json()).catch(e => console.log(e))

  return data.bitcoin.usd
}

const generateCandles = async () => {
  const messageChannel = await createMessageChannel()

  if(messageChannel) {
    while(true) {
      const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS
      const candle = new Candle("BTC")
  
      console.log("Generating new candle")
  
      for(let i = 0; i < loopTimes; i++) {
        const price = await readMarketPrice()
        candle.addValue(price)
        console.log("Market price #", i + 1, "of", loopTimes)
  
        await new Promise(resolve => setTimeout(resolve, Period.TEN_SECONDS))
      }
  
      candle.closeCandle()
      console.log("Candle close")
      const candleData = candle.toSimpleObject()
      console.log(candleData)
      const candleStr = JSON.stringify(candleData)
      messageChannel.sendToQueue(`${process.env.QUEUE_NAME}`, Buffer.from(candleStr))
      console.log("Candle sent to queue")
    }
  }

}

generateCandles()