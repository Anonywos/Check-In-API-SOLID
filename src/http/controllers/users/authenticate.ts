import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { AuthenticateUseCase } from '@/services/authenticate.js'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
	const authUserSchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	})

	const { email, password } = authUserSchema.parse(request.body)

	try {
		const prismaUsersRepository = new PrismaUsersRepository()
		const authUseCase = new AuthenticateUseCase(prismaUsersRepository)
		const { user } = await authUseCase.execute({
			email,
			password,
		})

		const token = await reply.jwtSign(
			{
				role: user.role,
			}, {
				sign: {
					sub: user.id,
				},
			})

		const refreshToken = await reply.jwtSign(
			{
				role: user.role,
			}, 
			{
				sign: {
					sub: user.id,
					expiresIn: '7d',//7 days
				},
			},
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({
				token,
			})
	} catch (e) {
		if (e instanceof InvalidCredentialsError) {
			return reply.status(400).send({
				message: e.message,
			})
		}
		throw e
	}
}