import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

function generatePassword(length = 12) {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

async function main() {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  const credentials: Array<{ id: string; name: string; role: string; email: string; password: string }> = [];

  for (const u of users) {
    const email = `${u.id}@demo.local`;
    const password = generatePassword(12);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: u.id },
      data: { email, passwordHash, updatedAt: new Date() },
    });
    credentials.push({ id: u.id, name: u.name, role: u.role, email, password });
  }

  const csvHeader = 'id,name,role,email,password\n';
  const csvRows = credentials
    .map((c) => `${c.id},"${c.name}",${c.role},${c.email},${c.password}`)
    .join('\n');
  const csvPath = join(process.cwd(), 'prisma', 'seeded-credentials.csv');
  writeFileSync(csvPath, csvHeader + csvRows + '\n', 'utf8');

  const txtPath = join(process.cwd(), 'prisma', 'seeded-credentials.txt');
  const txtBody = credentials
    .map((c) => `${c.role.padEnd(11)} | ${c.name.padEnd(24)} | ${c.email.padEnd(20)} | ${c.password}`)
    .join('\n');
  writeFileSync(
    txtPath,
    `# Demo credentials — generated ${new Date().toISOString()}\n\n` +
      'role        | name                     | email                | password\n' +
      '-'.repeat(80) +
      '\n' +
      txtBody +
      '\n',
    'utf8'
  );

  console.log(`Backfilled ${credentials.length} users.`);
  console.log(`CSV: ${csvPath}`);
  console.log(`TXT: ${txtPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
