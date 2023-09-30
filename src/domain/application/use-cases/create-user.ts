import { User } from '@/domain/enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { ConflictError } from '@/core/errors/application/conflict-error'
import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateUserUseCaseParams {
  name: string
  email: string
  password: string
}

type CreateUserUseCaseResult = Either<ConflictError, null>

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
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

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right(null)
  }
}
