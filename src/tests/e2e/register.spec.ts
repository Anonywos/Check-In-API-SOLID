import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let app: Awaited<typeof import('@/app.js')>['app']

describe('e2e - Register', () => {
	beforeAll(async () => {
		const appModule = await import('@/app.js')
		app = appModule.app

		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register', async () => {
		const response = await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email: 'johndoe@emial.com',
				password: '123456',
			})

		expect(response.statusCode).toEqual(201)
	})
})