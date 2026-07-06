import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from '@/services/authenticate.js'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let memoryRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase //sut - system under test

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		memoryRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(memoryRepository)
	})

	it('should be able to authenticate a user', async () => {
		await memoryRepository.create({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password_hash: await hash('123456', 6),
		})

		const { user } = await sut.execute({
			email: 'johndoe@email.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await memoryRepository.create({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password_hash: await hash('123456', 6),
		})

		await expect(() => sut.execute({
			email: 'marydoe@email.com',
			password: '123456',
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await memoryRepository.create({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password_hash: await hash('123456', 6),
		})

		await expect(() => sut.execute({
			email: 'marydoe@email.com',
			password: '654321',
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})