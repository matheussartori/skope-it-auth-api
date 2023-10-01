import { ForbiddenError } from '@/core/errors/application/forbidden-error'
import { UserRepository } from '../repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'

interface FetchUserUseCaseParams {
  userId: string
}

type FetchUserUseCaseResult = Either<
  ForbiddenError,
  {
    user: User
  }
>

@Injectable()
export class FetchUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: FetchUserUseCaseParams): Promise<FetchUserUseCaseResult> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ForbiddenError())
    }

    return right({
      user,
    })
  }
}
