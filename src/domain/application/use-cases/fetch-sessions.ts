import { Injectable } from '@nestjs/common'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { Either, right } from '@/core/either'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

interface FetchSessionsUseCaseParams {
  userId: string
}

type FetchSessionsUseCaseResult = Either<
  null,
  {
    refreshTokens: RefreshToken[]
  }
>

@Injectable()
export class FetchSessionsUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute({
    userId,
  }: FetchSessionsUseCaseParams): Promise<FetchSessionsUseCaseResult> {
    const refreshTokens =
      await this.refreshTokenRepository.findAllByUserId(userId)

    return right({
      refreshTokens,
    })
  }
}
