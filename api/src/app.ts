import Fastify from 'fastify'
import cors from '@fastify/cors'
import ListLastCandlesController from './controllers/ListLastCandlesController'

const listLastCandlesController = new ListLastCandlesController()

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/v1/candles/:quantity", listLastCandlesController.handle)

fastify.register(cors, {
  origin: "*"
})

export { fastify }