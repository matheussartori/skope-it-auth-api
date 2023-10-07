import { GenerateAccessTokenUseCase } from './generate-access-token'
import { InMemoryRefreshTokenRepository } from '@/test/repositories/in-memory-refresh-token-repository'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { ForbiddenError } from '@/core/errors/application/forbidden-error'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'
import { TokenExpiredError } from './errors/token-expired-error'

let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository
let fakeEncrypter: FakeEncrypter
let sut: GenerateAccessTokenUseCase

describe('generate access token use case', () => {
  beforeEach(() => {
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new GenerateAccessTokenUseCase(
      inMemoryRefreshTokenRepository,
      fakeEncrypter,
    )
  })

  it('should not be able to generate an access token with a invalid refresh token', async () => {
    const result = await sut.execute({
      refreshToken: 'non-existing-refresh-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to generate an access token if the refresh token is expired', async () => {
    const refreshToken = makeRefreshToken({
      expiredAt: new Date(Date.now() - 1000),
    })

    await inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TokenExpiredError)
  })

  it('should not be able to generate an access token if the refresh token is revoked', async () => {
    const refreshToken = makeRefreshToken({
      revokedAt: new Date(Date.now() - 1000),
    })

    await inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TokenExpiredError)
  })

  it('should be able to generate a refresh token', async () => {
    const refreshToken = makeRefreshToken()

    await inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    })

    expect(result.isRight()).toBe(true)
  })
})
