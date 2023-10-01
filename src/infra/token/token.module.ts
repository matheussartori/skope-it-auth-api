import { TokenGenerator } from '@/domain/application/token/token-generator'
import { Module } from '@nestjs/common'
import { UUIDGenerator } from './uuid-generator'

@Module({
  providers: [{ provide: TokenGenerator, useClass: UUIDGenerator }],
  exports: [TokenGenerator],
})
export class TokenModule {}
