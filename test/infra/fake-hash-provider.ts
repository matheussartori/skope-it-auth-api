import { HashProvider } from '@/infra/hash-provider'

export class FakeHashProvider implements HashProvider {
  generate(payload: string): Promise<string> {
    return Promise.resolve(payload)
  }

  compare(payload: string, hashed: string): Promise<boolean> {
    return Promise.resolve(payload === hashed)
  }
}
