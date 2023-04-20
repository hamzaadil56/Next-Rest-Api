import { NextRequest, NextResponse } from "next/server";
import sql from "@/db";

import { UUID } from "crypto";

// interface OrdersTable {
//   bookid: Number;
//   orderid: Generated<UUID>;
//   customername: string;
//   userid: UUID;
// }

// interface Database {
//   orders: OrdersTable;
// }
// const db = new Kysely<Database>({
//   dialect: new PostgresDialect({
//     pool: new Pool({
//       ssl: true,
//       connectionString: process.env.NEON_DATABASE_URL!,
//     }),
//   }),
// });

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  // const orders = await db.selectFrom("orders").selectAll().execute();
  const orders = await sql`select * from orders`;

  const order = orders.find((order) => order.orderid === params.orderId);
  if (!order) {
    return NextResponse.json(
      {
        message: "Not Found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json({
    order: order,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  // await db
  //   .deleteFrom("orders")
  //   .where("orders.orderid", "=", params.orderId)
  //   .executeTakeFirst();

  await sql`DELETE FROM "orders"
  WHERE
    "orders"."orderid" = ${params.orderId}`;
  return NextResponse.json({
    message: "Order Deleted",
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: UUID } }
) {
  const { customername } = await request.json();
  if (!customername) {
    return NextResponse.json(
      {
        message: "Please add customername",
      },
      {
        status: 409,
      }
    );
  }
  // const order = await db
  //   .updateTable("orders")
  //   .set({ customername })
  //   .where("orderid", "=", params.orderId)
  //   .executeTakeFirst();

  await sql`UPDATE orders
  SET customername = ${customername}
  WHERE orderid = ${params.orderId}`;

  return NextResponse.json({
    message: "Order Updated",
  });
}
