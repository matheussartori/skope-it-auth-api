import { InMemoryRefreshTokenRepository } from '@/test/repositories/in-memory-refresh-token-repository'
import { FetchActiveSessionsUseCase } from './fetch-active-sessions'
import { makeRefreshToken } from '@/test/factories/make-refresh-token'

let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository
let sut: FetchActiveSessionsUseCase

describe('fetch sessions use case', () => {
  beforeEach(() => {
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository()
    sut = new FetchActiveSessionsUseCase(inMemoryRefreshTokenRepository)
  })

  it('should return empty array if no sessions are found', async () => {
    const result = await sut.execute({
      userId: 'any_id',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.refreshTokens).toHaveLength(0)
  })

  it('should return the active sessions', async () => {
    const refreshToken = makeRefreshToken()

    await inMemoryRefreshTokenRepository.create(refreshToken)

    const result = await sut.execute({
      userId: refreshToken.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.refreshTokens).toHaveLength(1)
  })
})
