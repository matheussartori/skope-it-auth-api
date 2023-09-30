import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { makeUser } from '@/test/factories/make-user'
import { ConflictError } from '@/core/errors/application/conflict-error'
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: CreateUserUseCase

describe('create user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should not be able to register if the email is already in use', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })

  it('should be able to register an user', async () => {
    const user = makeUser()

    const result = await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(result.isRight()).toBe(true)
  })
})
