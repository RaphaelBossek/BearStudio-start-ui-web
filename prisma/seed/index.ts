import { db } from '../../src/server/db';

import { createBooks } from './book';
import { createMCPData } from './mcp';
import { createUsers } from './user';

async function main() {
  await createBooks();
  await createUsers();
  await createMCPData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
