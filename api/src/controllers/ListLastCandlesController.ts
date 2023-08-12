import { FastifyRequest, FastifyReply } from "fastify";
import { ListLastCandlesUseCase } from "../useCases/ListLastCandlesUseCase";

export default class ListLastCandlesController {
  async handle(request: FastifyRequest, response: FastifyReply) {
    const quantity = request.params

    const listLastCandlesUseCase = new ListLastCandlesUseCase()

    const candles = await listLastCandlesUseCase.execute(Number(quantity))

    return response.send(candles)
  }
}