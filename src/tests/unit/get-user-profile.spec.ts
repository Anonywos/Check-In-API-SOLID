import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js'
import { GetUserProfileUseCase } from '@/services/get-user-profile.js'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase //sut - system under test

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(memoryRepository)
	})

	it('should be able to get user profile', async () => {
		const createdUser = await memoryRepository.create({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password_hash: await hash('123456', 6),
		})

		const { user } = await sut.execute({
			userId: createdUser.id,
		})

		expect(user.id).toEqual(expect.any(String))
		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		await expect(() => sut.execute({
			userId: 'non-existing-id',
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})