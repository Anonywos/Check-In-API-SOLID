import type { Gym } from '@/generated/prisma/client.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'

interface FetchNearbyGymsUserCaseRequest {
	userLatitude: number
	userLongitude: number
}

interface FetchNearbyGymsUserCaseResponse {
	gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FetchNearbyGymsUserCaseRequest): Promise<FetchNearbyGymsUserCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
		)

		return {
			gyms,
		}
	}
}