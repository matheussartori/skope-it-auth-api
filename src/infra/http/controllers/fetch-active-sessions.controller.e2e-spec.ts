import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { makeUser } from '@/test/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'
import { PrismaRefreshTokenMapper } from '@/infra/database/prisma/mappers/prisma-refresh-token-mapper'

describe('fetch active sessions controller', () => {
  let app: INestApplication
  let prisma: PrismaService
  let encrypter: Encrypter

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    encrypter = moduleRef.get(Encrypter)

    await app.init()
  })

  test('[GET] /sessions', async () => {
    const user = makeUser()

    const prismaUser = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data: prismaUser,
    })

    const refreshToken = makeRefreshToken({
      userId: user.id,
    })

    const prismaRefreshToken = PrismaRefreshTokenMapper.toPrisma(refreshToken)

    await prisma.refreshToken.create({
      data: prismaRefreshToken,
    })

    const accessToken = await encrypter.encrypt({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/sessions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.activeSessions).toHaveLength(1)
  })
})
