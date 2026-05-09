import { prisma } from '@/lib/prisma';
import { getJakartaDate } from '@/lib/constants';

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      orderBy: { id: 'desc' }
    });
    return Response.json(products);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = await prisma.products.create({
      data: {
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        image: body.image,
        description: body.description,
        stock: parseInt(body.stock) || 0,
        updated_at: getJakartaDate()
      }
    });
    return Response.json(product);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error creating product' }, { status: 500 });
  }
}
