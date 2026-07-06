import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms.js'

export function makeFetchNearbyGymsUseCase() {
	const repository = new PrismaGymsRepository()
	const useCase = new FetchNearbyGymsUseCase(repository)

	return useCase
}