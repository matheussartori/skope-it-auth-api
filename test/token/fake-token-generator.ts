import { TokenGenerator } from '@/domain/application/token/token-generator'

export class FakeTokenGenerator implements TokenGenerator {
  async create(): Promise<string> {
    const token = [...Array(36)]
      .map(() => Math.random().toString(36)[2])
      .join('')

    return token
  }
}
