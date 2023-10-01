import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateUserController } from './controllers/create-user.controller'
import { TokenModule } from '../token/token.module'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'

@Module({
  imports: [DatabaseModule, CryptographyModule, TokenModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
