import { NotFoundError } from '@/core/errors/application/not-found-error'
import { UserRepository } from '../repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { AccessTokenProvider } from '@/infra/access-token-provider'
import { RefreshTokenProvider } from '@/infra/refresh-token-provider'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'
import { HashComparer } from '../cryptography/hash-comparer'

interface CreateSessionUseCaseParams {
  email: string
  password: string
}

type CreateUserUseCaseResult = Either<
  NotFoundError,
  {
    accessToken: string
  }
>

export class CreateSessionUseCase {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private hashComparer: HashComparer,
    private accessTokenProvider: AccessTokenProvider,
    private refreshTokenProvider: RefreshTokenProvider,
  ) {}

  async execute({
    email,
    password,
  }: CreateSessionUseCaseParams): Promise<CreateUserUseCaseResult> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new NotFoundError())
    }

    const passwordMatched = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!passwordMatched) {
      return left(new NotFoundError())
    }

    const accessToken = await this.accessTokenProvider.generate(
      user.id.toString(),
    )

    const refreshTokenRaw = await this.refreshTokenProvider.generate()

    const refreshToken = RefreshToken.create({
      userId: user.id,
      token: refreshTokenRaw,
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    await this.refreshTokenRepository.create(refreshToken)

    return right({
      accessToken,
      refreshToken,
    })
  }
}
