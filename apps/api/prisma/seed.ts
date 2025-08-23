import { PrismaClient, Role, UnitType, UnitStatus, Severity } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
	const password = await argon2.hash('ChangeMe123!');
	const admin = await prisma.user.upsert({
		where: { email: 'admin@endfcop.local' },
		create: { email: 'admin@endfcop.local', password, firstName: 'Admin', lastName: 'User', role: Role.ADMIN },
		update: {},
	});

	const unit = await prisma.unit.upsert({
		where: { name: '1st Infantry' },
		create: { name: '1st Infantry', type: UnitType.INFANTRY, status: UnitStatus.ACTIVE, location: { coordinates: [9.03, 38.74] } },
		update: {},
	});

	await prisma.event.create({
		data: {
			title: 'Patrol Report',
			description: 'Routine patrol completed',
			severity: Severity.LOW,
			location: { coordinates: [9.05, 38.75] },
			createdById: admin.id,
			unitId: unit.id,
		},
	});

	console.log('Seed completed');
}

main().finally(async () => {
	await prisma.$disconnect();
});