import { Either, left, right } from '@/core/either'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { ForbiddenError } from '@/core/errors/application/forbidden-error'
import { TokenExpiredError } from './errors/token-expired-error'
import { Encrypter } from '../cryptography/encrypter'

interface GenerateAccessTokenUseCaseParams {
  refreshToken: string
}

type GenerateAccessTokenUseCaseResult = Either<
  ForbiddenError | TokenExpiredError,
  {
    accessToken: string
  }
>

export class GenerateAccessTokenUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    refreshToken,
  }: GenerateAccessTokenUseCaseParams): Promise<GenerateAccessTokenUseCaseResult> {
    const refreshTokenExists =
      await this.refreshTokenRepository.findByToken(refreshToken)

    if (!refreshTokenExists) {
      return left(new ForbiddenError())
    }

    if (refreshTokenExists.isExpired()) {
      return left(new TokenExpiredError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: refreshTokenExists.userId,
    })

    return right({
      accessToken,
    })
  }
}
