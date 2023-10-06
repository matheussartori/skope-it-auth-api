import { GenerateAccessTokenUseCase } from '@/domain/application/use-cases/generate-access-token'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'

const generateAccessTokenBodySchema = z.object({
  refreshToken: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(generateAccessTokenBodySchema)

type GenerateAccessTokenBodySchema = z.infer<
  typeof generateAccessTokenBodySchema
>

@Controller('/access_token')
@Public()
export class GenerateAccessTokenController {
  constructor(private generateAccessToken: GenerateAccessTokenUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: GenerateAccessTokenBodySchema) {
    const { refreshToken } = body

    const result = await this.generateAccessToken.execute({ refreshToken })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}
