import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { LateCheckInValidateError } from '@/services/errors/late-check-in-validate-error.js'
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js'
import { ValidateCheckInUseCase } from '@/services/validate-check-in.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let memoryRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase 

describe('Valiate Check In Use Case', () => {
	beforeEach(async () => {
		memoryRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(memoryRepository)

		// await gymsRepository.create({
		// 	id: 'gym-01',
		// 	title: 'JS Gym',
		// 	description: '',
		// 	phone: '',
		// 	latitude: 0,
		// 	longitude: 0,
		// })

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate the check-in', async () => {
		const createdCheckIn = await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		})

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id,
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(memoryRepository.items[0]?.validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate an inexistent check-in', async () => {
		await expect(() => sut.execute({
			checkInId: 'inexistent_id',
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
		
		const createdCheckIn = await memoryRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01',
		})

		const twentyOneMinutesInMs = 1000*60*21

		vi.advanceTimersByTime(twentyOneMinutesInMs)

		await expect(sut.execute({
			checkInId: createdCheckIn.id,
		})).rejects.toBeInstanceOf(LateCheckInValidateError)
	})
})