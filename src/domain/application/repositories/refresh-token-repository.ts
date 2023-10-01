import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

export abstract class RefreshTokenRepository {
  abstract findById(id: string): Promise<RefreshToken | null>
  abstract findByToken(token: string): Promise<RefreshToken | null>
  abstract create(refreshToken: RefreshToken): Promise<void>
  abstract revoke(id: string): Promise<void>
}
