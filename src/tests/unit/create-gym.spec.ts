import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGymUseCase } from '@/services/create-gym.js'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register gym Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(memoryRepository)
	})

	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			title: 'JS Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})