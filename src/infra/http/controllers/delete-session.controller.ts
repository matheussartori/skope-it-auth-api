import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { DeleteSessionUseCase } from '@/domain/application/use-cases/delete-session'

const deleteSessionBodySchema = z.object({
  refreshTokenId: z.string(),
  userId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteSessionBodySchema)

type DeleteSessionBodySchema = z.infer<typeof deleteSessionBodySchema>

@Controller('/sessions')
@Public()
export class DeleteSessionController {
  constructor(private deleteSession: DeleteSessionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: DeleteSessionBodySchema) {
    const { refreshTokenId, userId } = body

    const result = await this.deleteSession.execute({
      refreshTokenId,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
