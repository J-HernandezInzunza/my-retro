// For more information on this file - https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#how-to-seed-your-database-in-prisma-orm
import { Prisma, PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed Retro Formats
  const retroFormats: Prisma.RetroFormatCreateInput[] = [
    {
      name: '4-Column Retrospective',
      slug: 'four-column',
      description: 'Traditional retrospective with four columns: What went well, What didn\'t go well, What have I learned, What still puzzles me',
      layoutConfig: {
        columns: [
          { id: 'went-well', title: 'What went well?' },
          { id: 'didnt-go-well', title: "What didn't go well?" },
          { id: 'learned', title: 'What have I learned?' },
          { id: 'puzzles', title: 'What still puzzles me?' },
        ],
      },
      interactionConfig: {
        voting: true,
        cardColors: ['#FFDDC1', '#FFABAB', '#D4F1F4', '#D4F1F4'],
      },
    },
    {
      name: 'Start, Stop, Continue',
      slug: 'start-stop-continue',
      description: 'A classic format for identifying what to keep doing, what to begin, and what to end.',
      layoutConfig: {
        columns: [
          { id: 'start', title: 'Start Doing' },
          { id: 'stop', title: 'Stop Doing' },
          { id: 'continue', title: 'Continue Doing' },
        ],
      },
      interactionConfig: {
        voting: true,
        cardColors: ['#FFDDC1', '#FFABAB', '#D4F1F4'],
      },
    },
    {
      name: '4 Ls',
      slug: '4-ls',
      description: 'Focuses on what was Liked, Learned, Lacked, and Longed For.',
      layoutConfig: {
        columns: [
          { id: 'liked', title: 'Liked' },
          { id: 'learned', title: 'Learned' },
          { id: 'lacked', title: 'Lacked' },
          { id: 'longed-for', title: 'Longed For' },
        ],
      },
      interactionConfig: {
        voting: true,
      },
    },
    {
      name: 'Mad, Sad, Glad',
      slug: 'mad-sad-glad',
      description: 'An emotions-focused retro to gauge team morale.',
      layoutConfig: {
        columns: [
          { id: 'mad', title: 'Mad' },
          { id: 'sad', title: 'Sad' },
          { id: 'glad', title: 'Glad' },
        ],
      },
      interactionConfig: {
        voting: false,
      },
    }
  ];

  for (const format of retroFormats) {
    await prisma.retroFormat.upsert({
      where: { slug: format.slug },
      update: {},
      create: format,
    });
    console.log(`Created/updated retro format: ${format.name}`);
  }

  // Seed a default team
  await prisma.team.upsert({
    where: { id: 'clg000000000000000000000' },
    update: {},
    create: {
      id: 'clg000000000000000000000',
      name: 'Alpha Team',
    },
  });
  console.log(`Created/updated default team: Alpha Team`);


  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
