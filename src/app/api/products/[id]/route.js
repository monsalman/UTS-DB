import { prisma } from '@/lib/prisma';
import { getJakartaDate } from '@/lib/constants';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  try {
    const product = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        image: body.image,
        description: body.description,
        stock: parseInt(body.stock),
        updated_at: getJakartaDate()
      }
    });
    return Response.json(product);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.products.delete({
      where: { id: parseInt(id) }
    });
    return Response.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
