import { NextRequest, NextResponse } from "next/server";

import { Pool } from "pg";

import { Kysely, PostgresDialect, Generated } from "kysely";

import { UUID } from "crypto";

interface OrdersTable {
  bookid: Number;
  orderid: Generated<UUID>;
  customername: string;
  userid: UUID;
}

interface Database {
  orders: OrdersTable;
}
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      ssl: true,
      connectionString: process.env.NEON_DATABASE_URL!,
    }),
  }),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  const orders = await db.selectFrom("orders").selectAll().execute();
  const order = orders.find((order) => order.orderid === params.orderId);
  if (!order) {
    return NextResponse.json({
      message: "Not Found",
      status: 404,
    });
  }
  return NextResponse.json({
    order: order,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  await db
    .deleteFrom("orders")
    .where("orders.orderid", "=", params.orderId)
    .executeTakeFirst();

  return NextResponse.json({
    message: "Order Deleted",
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  const { customername } = await request.json();
  if (!customername) {
    return NextResponse.json({
      message: "Please add customername",
      status: 404,
    });
  }
  const order = await db
    .updateTable("orders")
    .set({ customername })
    .where("orderid", "=", params.orderId)
    .executeTakeFirst();
  console.log(order);

  return NextResponse.json({
    message: "Order Updated",
  });
}
