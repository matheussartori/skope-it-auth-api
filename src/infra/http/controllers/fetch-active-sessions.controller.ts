import { FetchActiveSessionsUseCase } from '@/domain/application/use-cases/fetch-active-sessions'
import { Controller, Get, BadRequestException } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RefreshTokenPresenter } from '../presenters/RefreshTokenPresenter'

@Controller('/sessions')
export class FetchActiveSessionsController {
  constructor(private fetchActiveSessions: FetchActiveSessionsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchActiveSessions.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      activeSessions: result.value.refreshTokens.map(
        RefreshTokenPresenter.toHTTP,
      ),
    }
  }
}
