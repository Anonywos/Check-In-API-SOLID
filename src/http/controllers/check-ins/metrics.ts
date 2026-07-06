import { makeGetUserMetricsUseCase } from '@/services/factories/make-get-user-metrics-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
	const getUserMetricsCase = makeGetUserMetricsUseCase()
	const { checkInsCount } = await getUserMetricsCase.execute({
		userId: request.user.sub,
	})

	return reply.status(200).send({
		checkInsCount,
	})
}