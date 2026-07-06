import { makeValidateCheckInUseCase } from '@/services/factories/make-validate-check-in-use-case.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const validateCheckInSchema = z.object({
		checkInId: z.uuid(),
	})

	const { checkInId } = validateCheckInSchema.parse(request.params)

	
	const validateCheckInCase = makeValidateCheckInUseCase()
	await validateCheckInCase.execute({
		checkInId,
	})

	return reply.status(204).send()
}