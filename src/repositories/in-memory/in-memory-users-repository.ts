import type { User } from '@/generated/prisma/client.js'
import type { UserCreateInput } from '@/generated/prisma/models.js'
import { randomUUID } from 'node:crypto'
import type UsersRepository from '../users-repository.js'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async findById(id: string) {
		const userId = this.items.find((user) => user.id === id)

		return userId ? userId : null
	}

	async findByEmail(email: string) {
		const userEmail = this.items.find((user) => user.email === email)

		return userEmail ? userEmail : null
	}

	async create(data: UserCreateInput) {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		}

		this.items.push(user)

		return user
	}
}