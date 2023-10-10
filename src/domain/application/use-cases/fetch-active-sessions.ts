import { Injectable } from '@nestjs/common'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { Either, right } from '@/core/either'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

interface FetchActiveSessionsUseCaseParams {
  userId: string
}

type FetchActiveSessionsUseCaseResult = Either<
  null,
  {
    refreshTokens: RefreshToken[]
  }
>

@Injectable()
export class FetchActiveSessionsUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute({
    userId,
  }: FetchActiveSessionsUseCaseParams): Promise<FetchActiveSessionsUseCaseResult> {
    const refreshTokens =
      await this.refreshTokenRepository.findAllByUserId(userId)

    return right({
      refreshTokens,
    })
  }
}
