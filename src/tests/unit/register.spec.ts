import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js'
import { RegisterUseCase } from '@/services/register.js'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(memoryRepository)
	})

	it('should be able to create a user', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should be able to hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '123456',
		})

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash,
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@email.com'

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456',
		})

		await expect(() => 
			sut.execute({
				name: 'John Doe 2',
				email,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})