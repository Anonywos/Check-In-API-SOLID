import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { GetUserMetricsUseCase } from '@/services/get-user-metrics.js'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase 

describe('Get User Metrics Use Case', () => {
	beforeEach(async () => {
		memoryRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(memoryRepository)
	})

	it('should be able to get check-in count from user metrics', async () => {
		await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		})

		await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-02',
		})

		const { checkInsCount } = await sut.execute({
			userId: 'user-01',
		})

		expect(checkInsCount).toEqual(2)
	})
})