import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tables = await prisma.tables.findMany({
      orderBy: { table_number: 'asc' }
    });
    return Response.json(tables);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error fetching tables' }, { status: 500 });
  }
}

export async function POST(request) {
  const { table_number } = await request.json();
  try {
    const table = await prisma.tables.create({
      data: { table_number }
    });
    return Response.json(table);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error creating table' }, { status: 500 });
  }
}
