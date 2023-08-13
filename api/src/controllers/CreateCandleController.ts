import { CreateCandleUseCase } from "../useCases/CreateCandleUseCase";
import { Candle } from "../models/CandleModel";

export default class CreateCandleController {
  async handle(data: Candle) {
    const createCandleUseCase = new CreateCandleUseCase()

    createCandleUseCase.execute(data)
  }
}