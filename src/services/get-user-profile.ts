import type { User } from '@/generated/prisma/client.js'
import type UsersRepository from '@/repositories/users-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetUserProfileUseCaseRequest {
	userId: string
}

interface GetUserProfileUseCaseResponse {
	user: User
}

export class GetUserProfileUseCase {
	constructor(
		private usersRepository: UsersRepository,
	) {}

	//Auth
	async execute({
		userId,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user){
			throw new ResourceNotFoundError()
		}

		return {
			user,
		}
	}
}