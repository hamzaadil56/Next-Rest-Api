import postgres from "postgres";

const sql = postgres(process.env.NEON_DATABASE_URL!, {
  host: process.env.PGHOST, // Postgres ip address[s] or domain name[s]
  // Postgres server port[s]
  database: process.env.PGDATABASE, // Name of database to connect to
  username: process.env.PGUSER, // Username of database user
  password: process.env.PGPASSWORD, // Password of database user
  idle_timeout: 30,
  connect_timeout: 30,
  ssl: "require",
});

export default sql;
