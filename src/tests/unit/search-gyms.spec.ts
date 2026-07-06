import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { SearchGymsUseCase } from '@/services/search-gyms.js'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(memoryRepository)
	})

	it('should be able to search for gyms by query', async () => {
		await memoryRepository.create({
			title: 'JS Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		await memoryRepository.create({
			title: 'TS Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		const { gyms }  = await sut.execute({
			query: 'js',
			page: 1,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({
			title: 'JS Gym',
		})])
	})

	it('should be able to fetch paginated gyms search', async () => {
		for (let index = 1; index < 23; index++) {
			await memoryRepository.create({
				title: `JS Gym ${index}`,
				description: null,
				phone: null,
				latitude: 0,
				longitude: 0,
			})
		}

		const { gyms }  = await sut.execute({
			query: 'js',
			page: 2,
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({
				title: 'JS Gym 21',
			}),
			expect.objectContaining({
				title: 'JS Gym 22',
			}),
		])
	})
})