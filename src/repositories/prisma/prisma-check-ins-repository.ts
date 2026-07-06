import type { CheckIn } from '@/generated/prisma/client.js'
import type { CheckInUncheckedCreateInput } from '@/generated/prisma/models.js'
import { prisma } from '@/lib/prisma.js'
import dayjs from 'dayjs'
import type { CheckInsRepository } from '../check-in-repository.js'


export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: CheckInUncheckedCreateInput) {
		const checkIn = await prisma.checkIn.create({
			data,
		})

		return checkIn
	}
	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfDay = dayjs(date).startOf('date')
		const endOfDay = dayjs(date).endOf('date')

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfDay.toDate(),
					lte: endOfDay.toDate(),
				},
			},
		})

		return checkIn
	}
	async findManyByUserId(userId: string, page: number) {
		const itemPerPage = 20

		const checkIns = await prisma.checkIn.findMany({
			where: {
				user_id: userId,
			},
			take: itemPerPage,
			skip: (page - 1) * itemPerPage,
		})

		return checkIns
	}
	async countByUserId(userId: string) {
		const count = await prisma.checkIn.count({
			where: {
				user_id: userId,
			},
		})

		return count
	}
	async findById(id: string) {
		const checkIn = await prisma.checkIn.findUnique({
			where: {
				id,
			},
		})

		return checkIn
	}
	async save(data: CheckIn) {
		const checkIn = await prisma.checkIn.update({
			where: {
				id: data.id,
			},
			data,
		})

		return checkIn
	}

}