import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateUserController } from './controllers/create-user.controller'
import { TokenModule } from '../token/token.module'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { CreateSessionController } from './controllers/create-session.controller'
import { CreateSessionUseCase } from '@/domain/application/use-cases/create-session'
import { FetchUserController } from './controllers/fetch-user.controller'
import { FetchUserUseCase } from '@/domain/application/use-cases/fetch-user'
import { GenerateAccessTokenController } from './controllers/generate-access-token.controller'
import { GenerateAccessTokenUseCase } from '@/domain/application/use-cases/generate-access-token'
import { DeleteSessionController } from './controllers/delete-session.controller'
import { DeleteSessionUseCase } from '@/domain/application/use-cases/delete-session'

@Module({
  imports: [DatabaseModule, CryptographyModule, TokenModule],
  controllers: [
    CreateUserController,
    CreateSessionController,
    FetchUserController,
    GenerateAccessTokenController,
    DeleteSessionController,
  ],
  providers: [
    CreateUserUseCase,
    CreateSessionUseCase,
    FetchUserUseCase,
    GenerateAccessTokenUseCase,
    DeleteSessionUseCase,
  ],
})
export class HttpModule {}
