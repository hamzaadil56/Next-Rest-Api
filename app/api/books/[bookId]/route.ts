import { NextRequest, NextResponse } from "next/server";
import sql from "@/db";

// import { Generated } from "kysely";

// interface BooksTable {
//   id: Generated<number>;
//   name: string;
//   type: "fiction" | "non-fiction";
//   available: boolean;
// }

// interface Database {
//   books: BooksTable;
// }
type ParamsType = {
  bookId: string;
};
interface Params {
  params: ParamsType;
}
export async function GET(request: NextRequest, { params }: Params) {
  // const db = new Kysely<Database>({
  //   dialect: new PostgresDialect({
  //     pool: new Pool({
  //       ssl: true,
  //       connectionString: process.env.NEON_DATABASE_URL!,
  //     }),
  //   }),
  // });
  const books = await sql`SELECT * FROM books WHERE id = 1 LIMIT 1;`;
  const book = books[0];
  // .selectFrom("books")
  // .where("books.id", "=", params.bookId)
  // .executeTakeFirst();
  // const book = books.find((book) => book.id.toString() === params.bookId);

  return NextResponse.json({
    book: book,
  });
}
