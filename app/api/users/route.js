import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  const { googleId, email, name, imageUrl, lastSignIn } = await request.json();

  try {
    // Upsert the user in the database
    const user = await prisma.user.upsert({
      where: { googleId }, // Find the user by Google ID
      update: {
        name,
        email,
        imageUrl,
        lastSignIn: new Date(), // Update last sign-in time
      },
      create: {
        googleId,
        name,
        email,
        imageUrl,
        lastSignIn: new Date(), // Set last sign-in time during creation
      },
    });

    return NextResponse.json({ message: 'User created or updated', user });
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return NextResponse.json({ error: "An error occurred while creating or updating the user." }, { status: 500 });
  }
}
