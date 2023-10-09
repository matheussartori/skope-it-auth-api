import { BadRequestException, Body, Controller, Patch } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
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
@Public()
export class UpdatePasswordController {
  constructor(private updatePassword: UpdatePasswordUseCase) {}

  @Patch()
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
