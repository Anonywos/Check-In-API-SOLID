import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { AuthenticateUseCase } from '../authenticate.js'

export function makeAuthenticateUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const authUseCase = new AuthenticateUseCase(usersRepository)

	return authUseCase
}