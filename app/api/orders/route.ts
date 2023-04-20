import { NextRequest, NextResponse } from "next/server";
import sql from "@/db";

// import { Kysely, PostgresDialect, Generated } from "kysely";
// import { UUID } from "crypto";

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
export async function GET(request: NextRequest) {
  const headers = new Headers(request.headers);
  const userId = headers.get("UserId");
  // const orders = await db.selectFrom("orders").selectAll().execute();
  const orders = await sql`select * from orders`;
  const userOrders = orders.filter((order) => order.userid === userId);

  return NextResponse.json({ userOrders });
}

export async function POST(request: NextRequest) {
  const headers = new Headers(request.headers);
  const userId = headers.get("UserId");

  const { bookId, customerName } = await request.json();

  if (!bookId || !customerName) {
    return NextResponse.json({
      message: "Please Input Valid Credentials",
    });
  }

  // const order = await db
  //   .insertInto("orders")
  //   .values({
  //     bookid: bookId,
  //     customername: customerName,
  //     userid: userId as UUID,
  //   })
  //   .returningAll()
  //   .executeTakeFirst();

  const orders = await sql`INSERT INTO
  "orders" ("bookid", "customername", "userid")
VALUES
  (${bookId}, ${customerName}, ${userId})
RETURNING
  *`;
  const order = orders[0];
  const orderId = order?.orderid;

  return NextResponse.json({ created: true, orderId });
}
