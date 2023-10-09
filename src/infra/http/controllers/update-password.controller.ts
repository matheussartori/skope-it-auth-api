import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UpdatePasswordUseCase } from '@/domain/application/use-cases/update-password'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updatePasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updatePasswordBodySchema)

type UpdatePasswordBodySchema = z.infer<typeof updatePasswordBodySchema>

@Controller('/users/password')
export class UpdatePasswordController {
  constructor(private updatePassword: UpdatePasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UpdatePasswordBodySchema,
  ) {
    const { oldPassword, newPassword } = body
    const { sub: userId } = user

    const result = await this.updatePassword.execute({
      userId,
      oldPassword,
      newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
