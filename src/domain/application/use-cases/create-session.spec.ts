import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { FakeHashProvider } from '@/test/infra/fake-hash-provider'
import { CreateSessionUseCase } from './create-session'
import { FakeAccessTokenProvider } from '@/test/infra/fake-access-token-provider'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { FakeRefreshTokenProvider } from '@/test/infra/fake-refresh-token-provider'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHashProvider: FakeHashProvider
let fakeAccessTokenProvider: FakeAccessTokenProvider
let fakeRefreshTokenProvider: FakeRefreshTokenProvider
let sut: CreateSessionUseCase

describe('create session use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeAccessTokenProvider = new FakeAccessTokenProvider()
    fakeRefreshTokenProvider = new FakeRefreshTokenProvider()
    sut = new CreateSessionUseCase(
      inMemoryUserRepository,
      fakeHashProvider,
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

  it('should be able to create a session', async () => {
    const user = makeUser()
    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: user.password,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })
})
