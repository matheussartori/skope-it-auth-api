import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { makeUser } from '@/test/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'
import { HashComparer } from '@/domain/application/cryptography/hash-comparer'

describe('fetch user controller', () => {
  let app: INestApplication
  let prisma: PrismaService
  let hashGenerator: HashGenerator
  let encrypter: Encrypter
  let hashComparer: HashComparer

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    hashGenerator = moduleRef.get(HashGenerator)
    encrypter = moduleRef.get(Encrypter)
    hashComparer = moduleRef.get(HashComparer)

    await app.init()
  })

  test('[PATCH] /users/password', async () => {
    const user = makeUser({
      password: await hashGenerator.hash('SecurePassword@123'),
    })

    const prismaUser = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data: prismaUser,
    })

    const accessToken = await encrypter.encrypt({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'SecurePassword@123',
        newPassword: 'NewPassword@123',
      })

    const updatedUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    const newPasswordMatches = await hashComparer.compare(
      'NewPassword@123',
      updatedUser?.password,
    )

    expect(response.status).toBe(204)
    expect(newPasswordMatches).toBe(true)
  })
})
