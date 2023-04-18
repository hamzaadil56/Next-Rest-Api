import { NextRequest, NextResponse } from "next/server";

import { Pool } from "pg";

import { Kysely, PostgresDialect, Generated } from "kysely";

interface BooksTable {
  id: Generated<number>;
  name: string;
  type: "fiction" | "non-fiction";
  available: boolean;
}

interface Database {
  books: BooksTable;
}

export async function GET(request: NextRequest) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        ssl: true,
        connectionString: process.env.NEON_DATABASE_URL!,
      }),
    }),
  });
  const url = request.nextUrl;

  const books = await db.selectFrom("books").selectAll().execute();
  if (url.searchParams.has("type")) {
    const type = url.searchParams.get("type");
    const filteredBooks = books.filter((book) => book.type === type);
    return new NextResponse(JSON.stringify(filteredBooks));
  }
  if (url.searchParams.has("limit")) {
    let limit = url.searchParams.get("limit");
    let limitNumber = Number(limit);
    if (books.length > limitNumber) {
      books.length = limitNumber;
    }
    return new NextResponse(JSON.stringify(books));
  }
  return NextResponse.json({
    books: books,
  });
}
