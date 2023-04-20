import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sql from "@/db";

// import { Kysely, PostgresDialect, Generated } from "kysely";

// interface UsersTable {
//   clientname: string;
//   clientemail: string;
// }

// interface Database {
//   users: UsersTable;
// }

export async function POST(request: NextRequest) {
  const bodyRequest = await request.json();
  const { clientname, clientemail } = bodyRequest;
  if (!clientemail || !clientname) {
    throw new Error("Please add client Email");
  }

  // const oldUser = await db
  //   .selectFrom("users")
  //   .where("clientemail", "=", `${clientemail}`)
  //   .executeTakeFirst();

  const oldUsers =
    await sql`select * from users where clientemail = ${clientemail}`;
  const oldUser = oldUsers[0];
  if (oldUser) {
    return NextResponse.json(
      {
        message: "User Already Exist",
      },
      {
        status: 409,
      }
    );
  }
  // const user = await db
  //   .insertInto("users")
  //   .values({ clientemail: clientemail, clientname: clientname })
  //   .returningAll()
  //   .executeTakeFirst();

  const users = await sql`INSERT INTO
  "users" ("clientemail", "clientname")
VALUES
  (${clientemail}, ${clientname})
RETURNING
  *`;
  const user = users[0];
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days expiry
      ...user,
    },
    process.env.JWT_KEY!
  );
  const headers = new Headers(request.headers);
  headers.set("Authorization", token);
  return NextResponse.json({ access_token: token });
}
