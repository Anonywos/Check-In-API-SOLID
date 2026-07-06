import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { ValidateCheckInUseCase } from '../validate-check-in.js'

export function makeValidateCheckInUseCase() {
	const repository = new PrismaCheckInsRepository()
	const useCase = new ValidateCheckInUseCase(repository)

	return useCase
}