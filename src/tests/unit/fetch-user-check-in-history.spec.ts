import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { FetchUserCheckInHistoryUseCase } from '@/services/fetch-user-check-ins-history.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let memoryRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInHistoryUseCase 

describe('Fetch User Check-in History Use Case', () => {
	beforeEach(async () => {
		memoryRepository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInHistoryUseCase(memoryRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to fetch check-in history', async () => {
		await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		})

		await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-02',
		})

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 1,
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: 'gym-01'}),
			expect.objectContaining({gym_id: 'gym-02'}),
		])
	})

	it('should be able to fetch paginated check-in history', async () => {
		for (let i = 1; i < 23; i++) {
			await memoryRepository.create({
				user_id: 'user-01',
				gym_id: `gym-${i}`,
			})
		}

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 2,
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: 'gym-21'}),
			expect.objectContaining({gym_id: 'gym-22'}),
		])
	})
})