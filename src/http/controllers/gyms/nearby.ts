import { makeFetchNearbyGymsUseCase } from '@/services/factories/make-fetch-nearby-gyms-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
	const nearbyGymsSchema = z.object({
		latitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 100
		}),
	})

	const { latitude, longitude } = nearbyGymsSchema.parse(request.query)

	
	const nearbyGymsCase = makeFetchNearbyGymsUseCase()
	const { gyms } = await nearbyGymsCase.execute({
		userLatitude: latitude,
		userLongitude: longitude,
	})

	return reply.status(200).send({
		gyms,
	})
}