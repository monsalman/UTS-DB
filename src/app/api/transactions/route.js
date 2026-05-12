import { prisma } from '@/lib/prisma';
import { getJakartaDate } from '@/lib/constants';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get('tableId');

  try {
    const where = tableId ? { table_id: tableId } : {};
    
    const transactions = await prisma.transactions.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        employee: {
          select: { username: true }
        },
        table: {
          select: { table_number: true, status: true }
        }
      }
    });
    return Response.json(transactions);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error fetching transactions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { items, totalAmount, tableId, employeeId, paymentMethod } = await request.json();

    if (!items || items.length === 0) {
      return Response.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transactions.create({
        data: {
          total_amount: totalAmount,
          table_id: tableId?.toString() || null,
          employee_id: employeeId || null,
          payment_method: paymentMethod || 'cash',
          items: items,
          status: 'pending', // Default status for new orders
          created_at: getJakartaDate()
        }
      });

      for (const item of items) {
        const product = await tx.products.findUnique({
          where: { id: item.id }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.name || item.id}`);
        }

        await tx.products.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
            updated_at: getJakartaDate()
          }
        });
      }

      return transaction;
    });

    return Response.json({ message: 'Transaction completed successfully', transactionId: result.id });
  } catch (err) {
    console.error('Transaction error:', err);
    return Response.json({ message: err.message || 'Transaction failed' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const transaction = await prisma.transactions.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    return Response.json(transaction);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Error updating transaction status' }, { status: 500 });
  }
}
