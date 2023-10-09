import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { DeleteSessionUseCase } from '@/domain/application/use-cases/delete-session'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const deleteSessionBodySchema = z.object({
  refreshTokenId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteSessionBodySchema)

type DeleteSessionBodySchema = z.infer<typeof deleteSessionBodySchema>

@Controller('/sessions')
export class DeleteSessionController {
  constructor(private deleteSession: DeleteSessionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: DeleteSessionBodySchema,
  ) {
    const { refreshTokenId } = body

    const result = await this.deleteSession.execute({
      refreshTokenId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
