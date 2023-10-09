import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { envSchema } from '@/infra/env/env'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  const databaseUrl = env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const lastSlashPosition = databaseUrl.lastIndexOf('/')

  if (lastSlashPosition !== -1) {
    const databaseUrlBeforeSlash = databaseUrl.substring(
      0,
      lastSlashPosition + 1,
    )

    const testDatabaseUrl = databaseUrlBeforeSlash + schemaId

    return testDatabaseUrl
  } else {
    throw new Error('Malformed DATABASE_URL environment variable')
  }
}

const schemaId = randomUUID()

beforeAll(async () => {
  console.log('hello')
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  console.log(process.env.DATABASE_URL)

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS \`${schemaId}\``)
  await prisma.$disconnect()
})
