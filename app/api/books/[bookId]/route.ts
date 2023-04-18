import { NextRequest, NextResponse } from "next/server";

import { Pool } from "pg";

import {
  Kysely,
  PostgresDialect,
  Generated,
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from "kysely";

interface BooksTable {
  id: Generated<number>;
  name: string;
  type: "fiction" | "non-fiction";
  available: boolean;
}

interface Database {
  books: BooksTable;
}
type ParamsType = {
  bookId: string;
};
interface Params {
  params: ParamsType;
}
export async function GET(request: NextRequest, { params }: Params) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        ssl: true,
        connectionString: process.env.NEON_DATABASE_URL!,
      }),
    }),
  });
  console.log(params);
  const books = await db.selectFrom("books").selectAll("books").execute();
  const book = books.find((book) => book.id.toString() === params.bookId);

  return NextResponse.json({
    book: book,
  });
}
