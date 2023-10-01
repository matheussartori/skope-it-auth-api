import { Decrypter } from '../cryptography/decrypter'
import { UserRepository } from '../repositories/user-repository'
import { Either } from '@/core/either'

interface FetchUserUseCaseParams {
  accessToken: string
}

type FetchUserUseCaseResult = Either<null, null>

export class FetchUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private decrypter: Decrypter,
  ) {}

  async execute({ accessToken }: FetchUserUseCaseParams) {
    const payload = await this.decrypter.decrypt(accessToken)

    console.log({ payload })
  }
}
