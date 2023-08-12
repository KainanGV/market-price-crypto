import { Candle, CandleModel } from "../models/CandleModel";

export class CreateCandleUseCase {
  async execute(candle: Candle): Promise<Candle> {
    const newCandle = CandleModel.create(candle)

    return newCandle
  }
}