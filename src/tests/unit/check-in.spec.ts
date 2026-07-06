import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CheckinUseCase } from '@/services/checkin.js'
import { MaxDistanceError } from '@/services/errors/max-distance-error.js'
import { MaxNumberOfCheckInError } from '@/services/errors/max-numbers-of-check-in-error.js'
import { Decimal } from '@prisma/client/runtime/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let memoryRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase 

describe('Check In Use Case', () => {
	beforeEach(async () => {
		memoryRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckinUseCase(memoryRepository, gymsRepository)

		await gymsRepository.create({
			id: 'gym-01',
			title: 'JS Gym',
			description: '',
			phone: '',
			latitude: 0,
			longitude: 0,
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))

		await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		await expect( () => sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0,
		})).rejects.toBeInstanceOf(MaxNumberOfCheckInError)
	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))

		await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			title: 'JS Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-23.5452566),
			longitude: new Decimal(-46.6383126),
		})

		await expect(sut.execute({
			userId: 'user-01',
			gymId: 'gym-02',
			userLatitude: -23.5274167,
			userLongitude: -46.665485,
		})).rejects.toBeInstanceOf(MaxDistanceError)
	})
})