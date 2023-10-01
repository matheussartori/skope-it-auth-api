import { Controller, Get } from '@nestjs/common'
import { FetchUserUseCase } from '@/domain/application/use-cases/fetch-user'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/me')
export class FetchUserController {
  constructor(private fetchUser: FetchUserUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user)

    return {}
  }
}
