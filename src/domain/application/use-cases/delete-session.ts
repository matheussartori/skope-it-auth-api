import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/application/not-allowed-error'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { NotFoundError } from '@/core/errors/application/not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteSessionUseCaseParams {
  refreshTokenId: string
  userId: string
}

type DeleteSessionUseCaseResult = Either<NotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteSessionUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute({
    refreshTokenId,
    userId,
  }: DeleteSessionUseCaseParams): Promise<DeleteSessionUseCaseResult> {
    const refreshToken =
      await this.refreshTokenRepository.findById(refreshTokenId)

    if (refreshToken === null) {
      return left(new NotFoundError())
    }

    if (refreshToken.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    await this.refreshTokenRepository.revoke(refreshTokenId)

    return right(null)
  }
}
