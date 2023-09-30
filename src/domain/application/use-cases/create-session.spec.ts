import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { CreateSessionUseCase } from './create-session'
import { FakeAccessTokenProvider } from '@/test/infra/fake-access-token-provider'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { FakeRefreshTokenProvider } from '@/test/infra/fake-refresh-token-provider'
import { InMemoryRefreshTokenRepository } from '@/test/repositories/in-memory-refresh-token-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository
let fakeHasher: FakeHasher
let fakeAccessTokenProvider: FakeAccessTokenProvider
let fakeRefreshTokenProvider: FakeRefreshTokenProvider
let sut: CreateSessionUseCase

describe('create session use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository()
    fakeHasher = new FakeHasher()
    fakeAccessTokenProvider = new FakeAccessTokenProvider()
    fakeRefreshTokenProvider = new FakeRefreshTokenProvider()
    sut = new CreateSessionUseCase(
      inMemoryUserRepository,
      inMemoryRefreshTokenRepository,
      fakeHasher,
      fakeAccessTokenProvider,
      fakeRefreshTokenProvider,
    )
  })

  it('should not be able to create a session if the user does not exist', async () => {
    const result = await sut.execute({
      email: 'invalid_email',
      password: 'invalid_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
  })

  it('should not be able to create a session if the password does not match', async () => {
    const user = makeUser()
    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'invalid_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
  })

  it('should persist the refresh token in the repository', async () => {
    const createRefreshTokenSpy = vi.spyOn(
      inMemoryRefreshTokenRepository,
      'create',
    )

    const user = makeUser({
      password: await fakeHasher.hash('user-password'),
    })

    inMemoryUserRepository.create(user)

    await sut.execute({
      email: user.email,
      password: 'user-password',
    })

    expect(createRefreshTokenSpy).toHaveBeenCalledOnce()
  })

  it('should be able to create a session', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('user-password'),
    })

    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'user-password',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })
})
