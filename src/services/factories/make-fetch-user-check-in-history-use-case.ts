import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { FetchUserCheckInHistoryUseCase } from '../fetch-user-check-ins-history.js'

export function makeFetchCheckInUserHistoryUseCase() {
	const repository = new PrismaCheckInsRepository()
	const useCase = new FetchUserCheckInHistoryUseCase(repository)

	return useCase
}