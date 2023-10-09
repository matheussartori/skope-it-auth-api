import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { makeUser } from '@/test/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'

describe('create session controller', () => {
  let app: INestApplication
  let prisma: PrismaService
  let hashGenerator: HashGenerator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    hashGenerator = moduleRef.get(HashGenerator)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const user = makeUser({
      password: await hashGenerator.hash('SecurePassword@123'),
    })

    const prismaUser = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data: prismaUser,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: 'SecurePassword@123',
    })

    expect(response.status).toBe(201)
    expect(response.body.accessToken).toBeTruthy()
    expect(response.body.refreshToken).toBeTruthy()
  })
})
