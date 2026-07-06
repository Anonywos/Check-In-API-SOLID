import { makeCreateGymUseCase } from '@/services/factories/make-create-gym-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create (request: FastifyRequest, reply: FastifyReply) {
	const createGymSchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine(value => {
			return Math.abs(value) <= 100
		}),
	})

	const { title, description, phone, latitude, longitude } = createGymSchema.parse(request.body)

	
	const createGymCase = makeCreateGymUseCase()
	await createGymCase.execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	})

	return reply.status(201).send()
}