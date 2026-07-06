import type { User } from '@/generated/prisma/client.js'
import type UsersRepository from '@/repositories/users-repository.js'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

interface RegisterUserCaseRequest {
	name: string,
	email: string,
	password: string
}

interface RegisterUserCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
		const password_hash = await hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findByEmail(email)
		
		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		})

		return {
			user,
		}
	}
}