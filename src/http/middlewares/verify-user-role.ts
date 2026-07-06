import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleVerify: 'ADMIN' | 'MEMBER') {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user

		if (role !== roleVerify) {
			reply.status(401).send({
				message: 'Unauthorized',
			})
			return
		}
	}
}