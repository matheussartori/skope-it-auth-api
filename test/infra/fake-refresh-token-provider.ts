import { RefreshTokenProvider } from '@/infra/refresh-token-provider'

export class FakeRefreshTokenProvider implements RefreshTokenProvider {
  generate(): Promise<string> {
    return Promise.resolve('any_refresh_token')
  }
}
