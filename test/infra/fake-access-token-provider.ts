import { AccessTokenProvider } from '@/infra/access-token-provider'

export class FakeAccessTokenProvider implements AccessTokenProvider {
  generate(payload: string): Promise<string> {
    return Promise.resolve(payload)
  }

  verify(token: string): Promise<string> {
    return Promise.resolve(token)
  }
}
