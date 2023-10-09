import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { makeUser } from '@/test/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'
import { PrismaRefreshTokenMapper } from '@/infra/database/prisma/mappers/prisma-refresh-token-mapper'

describe('generate access token controller', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /access_token', async () => {
    const user = makeUser()

    const prismaUser = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data: prismaUser,
    })

    const refreshToken = makeRefreshToken()

    const prismaRefreshToken = PrismaRefreshTokenMapper.toPrisma(refreshToken)

    await prisma.refreshToken.create({
      data: prismaRefreshToken,
    })

    const response = await request(app.getHttpServer())
      .post('/access_token')
      .send({
        refreshToken: refreshToken.token,
      })

    expect(response.status).toBe(201)
    expect(response.body.accessToken).toBeTruthy()
  })
})
