import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { CreateGymUseCase } from '../create-gym.js'

export function makeCreateGymUseCase() {
	const repository = new PrismaGymsRepository()
	const useCase = new CreateGymUseCase(repository)

	return useCase
}