import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateUserController } from './controllers/create-user.controller'
import { TokenModule } from '../token/token.module'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { CreateSessionController } from './controllers/create-session.controller'
import { CreateSessionUseCase } from '@/domain/application/use-cases/create-session'

@Module({
  imports: [DatabaseModule, CryptographyModule, TokenModule],
  controllers: [CreateUserController, CreateSessionController],
  providers: [CreateUserUseCase, CreateSessionUseCase],
})
export class HttpModule {}
