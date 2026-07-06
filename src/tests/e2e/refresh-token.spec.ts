import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e - Refresh token', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email: 'johndoe@emial.com',
				password: '123456',
			})

		const authResponse = await request(app.server)
			.post('/sessions')
			.send({
				email: 'johndoe@emial.com',
				password: '123456',
			})

		const cookies = authResponse.get('Set-Cookie')

		if (!cookies) {
			throw new Error('Set-Cookie not found')
		}

		const response = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken='),
		])
	})
})