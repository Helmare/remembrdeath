import dotenv from 'dotenv';
import postgres from 'postgres';

// Load .env file.
dotenv.config();
const {
  // Postgres
  PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID,
  // X Credentials
  X_APP_KEY, X_APP_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
} = process.env;

console.log('connecting to Postgres server...');
const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

console.log('querying a random post...');
const result = await sql`
  SELECT * FROM posts
  ORDER BY RANDOM()
  LIMIT 1;
`;
await sql.end();

if (result.length == 0) {
  console.error('failed to get random post.');
  process.exit(-1);
}
const post = result[0];
if (!post.message) {
  console.error('post does not contain message field.');
  process.exit(-1);
}

console.log(`got post: ${post.message}`);