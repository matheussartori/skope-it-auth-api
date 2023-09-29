import { User } from '@/domain/enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { ConflictError } from '@/core/errors/application/conflict-error'
import { Either, left, right } from '@/core/either'
import { HashProvider } from '@/infra/hash-provider'

interface CreateUserUseCaseParams {
  name: string
  email: string
  password: string
}

type CreateUserUseCaseResult = Either<ConflictError, object>

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProvider,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseParams): Promise<CreateUserUseCaseResult> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new ConflictError())
    }

    const hashedPassword = await this.hashProvider.generate(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right({})
  }
}
