import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UserRepository } from '../repositories/user-repository'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { NotAllowedError } from '@/core/errors/application/not-allowed-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { InvalidPasswordError } from './errors/invalid-password-error'

interface UpdatePasswordUseCaseParams {
  userId: string
  oldPassword: string
  newPassword: string
}

type UpdatePasswordUseCaseResult = Either<
  NotFoundError | NotAllowedError | InvalidPasswordError,
  null
>

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    oldPassword,
    newPassword,
  }: UpdatePasswordUseCaseParams): Promise<UpdatePasswordUseCaseResult> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new NotFoundError())
    }

    const oldPasswordMatches = await this.hashComparer.compare(
      oldPassword,
      user.password,
    )

    if (!oldPasswordMatches) {
      return left(new NotAllowedError())
    }

    try {
      await user.updatePassword(newPassword, this.hashGenerator)
    } catch (error) {
      return left(new InvalidPasswordError())
    }

    await this.userRepository.save(user)

    return right(null)
  }
}
