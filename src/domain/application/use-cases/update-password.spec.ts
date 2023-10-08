import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { UpdatePasswordUseCase } from './update-password'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { NotAllowedError } from '@/core/errors/application/not-allowed-error'
import { InvalidPasswordError } from './errors/invalid-password-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: UpdatePasswordUseCase

describe('update password use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new UpdatePasswordUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should not be able to update the password of a non-existing user', async () => {
    const result = await sut.execute({
      userId: 'non-existing-user-id',
      oldPassword: 'old-password',
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
  })

  it('should not be able to update the password if the old password does not match', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: 'invalid-password',
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to update the password if the new password is not secure enough', async () => {
    const oldPassword = await fakeHasher.hash('insecure-password')

    const user = makeUser({
      password: oldPassword,
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: 'insecure-password',
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to update the password', async () => {
    const oldPassword = await fakeHasher.hash('old-password')

    const user = makeUser({
      password: oldPassword,
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: 'old-password',
      newPassword: 'SecurePassword@123',
    })

    expect(result.isRight()).toBe(true)
  })
})
