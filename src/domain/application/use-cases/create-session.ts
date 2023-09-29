import { NotFoundError } from '@/core/errors/application/not-found-error'
import { UserRepository } from '../repositories/user-repository'
import { HashProvider } from '@/infra/hash-provider'
import { Either, left, right } from '@/core/either'
import { AccessTokenProvider } from '@/infra/access-token-provider'
import { RefreshTokenProvider } from '@/infra/refresh-token-provider'

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
    private hashProvider: HashProvider,
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

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.password,
    )

    if (!passwordMatched) {
      return left(new NotFoundError())
    }

    const accessToken = await this.accessTokenProvider.generate(
      user.id.toString(),
    )

    const refreshToken = await this.refreshTokenProvider.generate()

    return right({
      accessToken,
      refreshToken,
    })
  }
}
