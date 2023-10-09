import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { makeUser } from '@/test/factories/make-user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'
import { PrismaRefreshTokenMapper } from '@/infra/database/prisma/mappers/prisma-refresh-token-mapper'
import { Encrypter } from '@/domain/application/cryptography/encrypter'

describe('delete session controller', () => {
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

  test('[DELETE] /sessions', async () => {
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

    const accessToken = await encrypter.encrypt({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete('/sessions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshTokenId: refreshToken.id.toString(),
      })

    expect(response.status).toBe(204)
    expect(response.body.accessToken).toBeTruthy()
  })
})
