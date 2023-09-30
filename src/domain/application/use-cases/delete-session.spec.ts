import { InMemoryRefreshTokenRepository } from '@/test/repositories/in-memory-refresh-token-repository'
import { DeleteSessionUseCase } from './delete-session'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'
import { NotAllowedError } from '@/core/errors/application/not-allowed-error'

let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository
let sut: DeleteSessionUseCase

describe('delete session use case', () => {
  beforeEach(() => {
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository()
    sut = new DeleteSessionUseCase(inMemoryRefreshTokenRepository)
  })

  it('should not be able to delete a non-existent session', async () => {
    const result = await sut.execute({
      refreshTokenId: 'invalid_refresh_token_id',
      userId: 'invalid_user_id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
  })

  it('should not be able to delete a token from another user', async () => {
    const user = makeUser({}, new UniqueEntityID('user_id'))
    const refreshToken = makeRefreshToken()

    inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      refreshTokenId: refreshToken.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to delete a session', async () => {
    const user = makeUser()
    const refreshToken = makeRefreshToken({
      userId: user.id,
    })

    inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      refreshTokenId: refreshToken.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })
})
