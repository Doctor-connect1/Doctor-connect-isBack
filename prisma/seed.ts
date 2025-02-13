import { PrismaClient } from '@prisma/client';
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = [];
  for (let i = 0; i < 200; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['Doctor', 'Patient', 'Admin']),
        locationLatitude: faker.address.latitude(),
        locationLongitude: faker.address.longitude(),
        bio: faker.lorem.paragraph(),
        meetingPrice: faker.finance.amount(),
      },
    });
    users.push(user);
  }

  // Create Doctors
  const doctors = [];
  for (let i = 0; i < 100; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        specialty: faker.name.jobTitle(),
        experience: faker.datatype.number({ min: 1, max: 30 }),
        bio: faker.lorem.paragraph(),
        isVerified: faker.datatype.boolean(),
        locationLatitude: faker.address.latitude(),
        locationLongitude: faker.address.longitude(),
        userId: users[i].id,
      },
    });
    doctors.push(doctor);
  }

  // Create Patients
  const patients = [];
  for (let i = 100; i < 200; i++) {
    const patient = await prisma.patient.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.past(30),
        gender: faker.helpers.arrayElement(['Male', 'Female']),
        medicalHistory: faker.lorem.paragraph(),
        locationLatitude: faker.address.latitude(),
        locationLongitude: faker.address.longitude(),
        password: faker.internet.password(),
        bio: faker.lorem.paragraph(),
        userId: users[i].id,
      },
    });
    patients.push(patient);
  }

  // Create Appointments
  for (let i = 0; i < 200; i++) {
    await prisma.appointment.create({
      data: {
        patientID: patients[i % patients.length].id,
        doctorID: doctors[i % doctors.length].id,
        appointmentDate: faker.date.future(),
        durationMinutes: faker.datatype.number({ min: 15, max: 120 }),
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'rejected']),
        type: faker.helpers.arrayElement(['SUR_TERRAIN', 'DISTANCE']),
      },
    });
  }

  // Create Availabilities
  for (const doctor of doctors) {
    for (let i = 0; i < 5; i++) {
      await prisma.availability.create({
        data: {
          doctorID: doctor.id,
          availableDate: faker.date.future(),
          startTime: faker.date.future().toISOString(),
          endTime: faker.date.future().toISOString(),
          isAvailable: faker.datatype.boolean(),
        },
      });
    }
  }

  // Create Chatrooms
  for (let i = 0; i < 100; i++) {
    await prisma.chatrooms.create({
      data: {
        patientID: patients[i].id,
        doctorID: doctors[i].id,
        startTime: faker.date.past(),
      },
    });
  }

  // Create ChatroomMessages
  const chatrooms = await prisma.chatrooms.findMany();
  for (const chatroom of chatrooms) {
    for (let i = 0; i < 10; i++) {
      await prisma.chatroomMessage.create({
        data: {
          chatroomID: chatroom.id,
          senderID: faker.helpers.arrayElement([chatroom.patientID, chatroom.doctorID]),
          messageText: faker.lorem.sentence(),
        },
      });
    }
  }

  // Create DoctorReviews
  for (const doctor of doctors) {
    for (let i = 0; i < 5; i++) {
      await prisma.doctorReview.create({
        data: {
          doctorID: doctor.id,
          patientID: patients[i].id,
          rating: faker.datatype.number({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          reviewText: faker.lorem.paragraph(),
          reviewDate: faker.date.past(),
        },
      });
    }
  }

  // Create Media
  for (const user of users) {
    await prisma.media.create({
      data: {
        userID: user.id,
        url: faker.image.avatar(),
      },
    });
  }

  // Create Specialties
  for (let i = 0; i < 50; i++) {
    await prisma.specialty.create({
      data: {
        name: faker.name.jobTitle(),
        userId: users[i].id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });