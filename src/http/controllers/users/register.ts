import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js'
import { RegisterUseCase } from '@/services/register.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function register (request: FastifyRequest, reply: FastifyReply) {
	const registerUserSchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerUserSchema.parse(request.body)

	try {
		const prismaUsersRepository = new PrismaUsersRepository()
		const registerUseCase = new RegisterUseCase(prismaUsersRepository)
		await registerUseCase.execute({
			name,
			email,
			password,
		})
	} catch (e) {
		if (e instanceof UserAlreadyExistsError) {
			return reply.status(409).send({
				message: e.message,
			})
		}
		throw e
	}

	return reply.status(201).send()
}