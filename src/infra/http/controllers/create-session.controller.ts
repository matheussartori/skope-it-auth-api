import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateSessionUseCase } from '@/domain/application/use-cases/create-session'
import { Public } from '@/infra/auth/public'

const createSessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createSessionBodySchema)

type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>

@Controller('/sessions')
@Public()
export class CreateSessionController {
  constructor(private createSession: CreateSessionUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateSessionBodySchema) {
    const { email, password } = body

    const result = await this.createSession.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      accessToken: result.value.accessToken,
      refreshToken: result.value.refreshToken,
    }
  }
}
