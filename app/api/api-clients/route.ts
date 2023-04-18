import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { Pool } from "pg";

import { Kysely, PostgresDialect, Generated } from "kysely";
import Head from "@/app/head";

interface UsersTable {
  clientname: string;
  clientemail: string;
}

interface Database {
  users: UsersTable;
}

export async function POST(request: NextRequest) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        ssl: true,
        connectionString: process.env.NEON_DATABASE_URL!,
      }),
    }),
  });
  const bodyRequest = await request.json();
  const { clientname, clientemail } = bodyRequest;
  if (!clientemail || !clientname) {
    throw new Error("Please add client Email");
  }

  const oldUser = await db
    .selectFrom("users")
    .where("clientemail", "=", `${clientemail}`)
    .executeTakeFirst();
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
  const user = await db
    .insertInto("users")
    .values({ clientemail: clientemail, clientname: clientname })
    .returningAll()
    .executeTakeFirst();
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
