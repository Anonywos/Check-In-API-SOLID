import type { CheckIn } from '@/generated/prisma/client.js'
import type { CheckInsRepository } from '@/repositories/check-in-repository.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'
import getDistanceBetweenCoordinates from '@/utils/get-distance-between-coordinates.js'
import { MaxDistanceError } from './errors/max-distance-error.js'
import { MaxNumberOfCheckInError } from './errors/max-numbers-of-check-in-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface CheckinUseCaseRequest {
	userId: string
	gymId: string
	userLatitude: number
	userLongitude: number
}

interface CheckinUseCaseResponse {
	checkIn: CheckIn
}

export class CheckinUseCase {
	constructor(
		private checkInRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
		const MAX_DISTANCE_IN_KM = 0.1
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		// calculate distance between user and gym
		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		)

		if (distance > MAX_DISTANCE_IN_KM) {
			throw new MaxDistanceError()
		}

		const verifyCheckInDate = await this.checkInRepository.findByUserIdOnDate(
			userId,
			new Date(),
		)

		if (verifyCheckInDate) {
			throw new MaxNumberOfCheckInError()
		}

		const checkIn = await this.checkInRepository.create({
			user_id: userId,
			gym_id: gymId,
		})

		return {
			checkIn,
		}
	}
}