import 'dotenv/config'
import { execSync } from 'node:child_process'
import { Client } from 'pg'
import type { Environment } from 'vitest/environments'

async function cleanDatabase() {
	if (!process.env.DATABASE_URL_TEST) {
		throw new Error('Please provide a DATABASE_URL_TEST env variable')
	}

	const client = new Client({
		connectionString: process.env.DATABASE_URL_TEST,
	})

	await client.connect()

	try {
		const databaseResult = await client.query<{
			current_database: string
		}>('SELECT current_database()')

		const currentDatabase = databaseResult.rows[0]?.current_database

		if (currentDatabase !== 'apisolid_test') {
			throw new Error(
				`Refusing to clean database "${currentDatabase}". Expected "apisolid_test".`,
			)
		}

		await client.query(`
			TRUNCATE TABLE
				"check_ins",
				"gyms",
				"users"
			RESTART IDENTITY CASCADE
		`)
	} finally {
		await client.end()
	}
}

export default <Environment>{
	name: 'prisma',
	viteEnvironment: 'ssr',

	async setup() {
		if (!process.env.DATABASE_URL_TEST) {
			throw new Error('Please provide a DATABASE_URL_TEST env variable')
		}

		process.env.NODE_ENV = 'test'
		process.env.DATABASE_URL = process.env.DATABASE_URL_TEST

		execSync('npx prisma db push --force-reset', {
			stdio: 'inherit',
			env: {
				...process.env,
				DATABASE_URL: process.env.DATABASE_URL_TEST,
			},
		})

		await cleanDatabase()

		return {
			async teardown() {
				await cleanDatabase()
			},
		}
	},
}