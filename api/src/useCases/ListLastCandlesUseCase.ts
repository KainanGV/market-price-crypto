import { Candle, CandleModel } from "../models/CandleModel";

export class ListLastCandlesUseCase {
  async execute(quantity: number): Promise<Candle[]> {
    const result = quantity > 0 ? quantity : 10

    const lastCandles = await CandleModel.find().sort({ _id: -1 }).limit(result)

    return lastCandles
  }
}