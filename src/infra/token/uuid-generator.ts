import { TokenGenerator } from '@/domain/application/token/token-generator'
import { randomUUID } from 'crypto'

export class UUIDGenerator implements TokenGenerator {
  async create(): Promise<string> {
    const uuid = randomUUID()

    return uuid
  }
}
