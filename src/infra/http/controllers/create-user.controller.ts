import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { name, email, password } = body

    const result = await this.createUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
