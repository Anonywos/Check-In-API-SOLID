import { makeSearchGymsUseCase } from '@/services/factories/make-search-gyms-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const searchGymsSchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	})

	const { q, page } = searchGymsSchema.parse(request.query)

	
	const searchGymCase = makeSearchGymsUseCase()
	const { gyms } = await searchGymCase.execute({
		query: q,
		page,
	})

	return reply.status(200).send({
		gyms,
	})
}