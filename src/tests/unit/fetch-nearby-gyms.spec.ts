import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { FetchNearbyGymsUseCase } from '@/services/fetch-nearby-gyms.js'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(memoryRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await memoryRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -23.5428817,
			longitude: -46.3177962,
		})

		await memoryRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -23.5435661,
			longitude: -46.6372658,
		})

		const { gyms }  = await sut.execute({
			userLatitude: -23.5452698,
			userLongitude: -46.6384716,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({
			title: 'Near Gym',
		})])
	})
})