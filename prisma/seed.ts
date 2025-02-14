import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  // Create Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: hashedPassword,
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['Doctor', 'Patient', 'Admin']),
        locationLatitude: new Decimal(faker.location.latitude()),
        locationLongitude: new Decimal(faker.location.longitude()),
        bio: faker.lorem.sentence(10),
        meetingPrice: new Decimal(faker.number.float({ min: 50, max: 200 })),
      },
    });
    users.push(user);
  }

  // Create Doctors
  const doctors = [];
  for (let i = 0; i < 5; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        phone: faker.phone.number(),
        specialty: faker.person.jobTitle(),
        experience: faker.number.int({ min: 1, max: 30 }),
        bio: faker.lorem.sentence(10),
        isVerified: faker.datatype.boolean(),
        locationLatitude: new Decimal(faker.location.latitude()),
        locationLongitude: new Decimal(faker.location.longitude()),
        userId: users[i].id,
      },
    });
    doctors.push(doctor);
  }

  // Create Patients
  const patients = [];
  for (let i = 5; i < 10; i++) {
    const patient = await prisma.patient.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.past({ years: 30 }),
        gender: faker.helpers.arrayElement(['Male', 'Female']),
        medicalHistory: faker.lorem.sentence(10),
        locationLatitude: new Decimal(faker.location.latitude()),
        locationLongitude: new Decimal(faker.location.longitude()),
        password: await bcrypt.hash('password123', 10),
        profilePicture: faker.image.avatar(),
        user: {
          connect: {
            id: users[i].id
          }
        }
      },
    });
    patients.push(patient);
  }

  console.log({
    users: users.length,
    doctors: doctors.length,
    patients: patients.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });