import type { Gym } from '@/generated/prisma/client.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'

interface SearchGymsUserCaseRequest {
	query: string
	page: number
}

interface SearchGymsUserCaseResponse {
	gyms: Gym[]
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymsUserCaseRequest): Promise<SearchGymsUserCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(
			query,
			page,
		)

		return {
			gyms,
		}
	}
}