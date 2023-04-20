import { NextRequest, NextResponse } from "next/server";
import sql from "@/db";

// import { Kysely, PostgresDialect, Generated } from "kysely";

// interface BooksTable {
//   id: Generated<number>;
//   name: string;
//   type: "fiction" | "non-fiction";
//   available: boolean;
// }

// interface Database {
//   books: BooksTable;
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
  const url = request.nextUrl;

  const books = await sql`
SELECT
  *
FROM
  "books"
`;
  let filteredBooks;
  if (url.searchParams.has("type") && url.searchParams.has("limit")) {
    const type = url.searchParams.get("type");
    const limit = url.searchParams.get("limit");
    filteredBooks = books.filter((book) => book.type === type);
    let limitNumber = Number(limit);
    if (filteredBooks.length > limitNumber) {
      filteredBooks.length = limitNumber;
    }
    return NextResponse.json({
      books: filteredBooks,
    });
  }
  if (url.searchParams.has("type") || url.searchParams.has("limit")) {
    let type = url.searchParams.get("type");
    let limit = url.searchParams.get("limit");
    if (type) {
      filteredBooks = books.filter((book) => book.type === type);
      return NextResponse.json({
        books: filteredBooks,
      });
    }
    if (limit) {
      let limitNumber = Number(limit);
      if (books.length > limitNumber) {
        books.length = limitNumber;
      }
      return NextResponse.json({
        books: books,
      });
    }
  }

  return NextResponse.json({
    books: books,
  });
}
