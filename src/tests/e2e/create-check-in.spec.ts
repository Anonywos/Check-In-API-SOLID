import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e - Create check-in', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const gym = await prisma.gym.create({
			data: {
				title: 'JavaScript Gym',
				latitude: -23.5435661,
				longitude: -46.6372658,
			},
			
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -23.5435661,
				longitude: -46.6372658,
			}) 

		expect(response.statusCode).toEqual(201)
	})
})