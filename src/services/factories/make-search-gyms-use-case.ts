import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { SearchGymsUseCase } from '../search-gyms.js'

export function makeSearchGymsUseCase() {
	const repository = new PrismaGymsRepository()
	const useCase = new SearchGymsUseCase(repository)

	return useCase
}