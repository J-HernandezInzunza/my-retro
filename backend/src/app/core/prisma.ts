import { PrismaClient } from '../../generated/prisma';

// Instantiate a single PrismaClient instance to be used throughout the application.
// This is a best practice to avoid creating too many connections to the database.
export const prisma = new PrismaClient();
