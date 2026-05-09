import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.employees.delete({
      where: { id: parseInt(id) }
    });
    return Response.json({ message: 'Staff member removed' });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error removing staff' }, { status: 500 });
  }
}
