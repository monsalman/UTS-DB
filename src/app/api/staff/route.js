import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      select: { id: true, username: true, role: true },
      orderBy: { id: 'desc' }
    });
    return Response.json(employees);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error fetching staff' }, { status: 500 });
  }
}

export async function POST(request) {
  const { username, password, role } = await request.json();
  
  if (!username || !password) {
    return Response.json({ message: 'Username and password required' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employees.create({
      data: {
        username,
        password: hashedPassword,
        role: role || 'employee'
      },
      select: { id: true, username: true, role: true }
    });
    return Response.json(employee);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') { // Unique constraint violation in Prisma
      return Response.json({ message: 'Username already exists' }, { status: 400 });
    }
    return Response.json({ message: 'Error creating staff' }, { status: 500 });
  }
}
