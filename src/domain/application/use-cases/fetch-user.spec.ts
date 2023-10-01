import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { FetchUserUseCase } from './fetch-user'
import { ForbiddenError } from '@/core/errors/application/forbidden-error'
import { makeUser } from '@/test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchUserUseCase

describe('fetch user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchUserUseCase(inMemoryUserRepository)
  })

  it('should return an error if the user does not exists', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should return an user', async () => {
    const user = makeUser()

    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })
})
