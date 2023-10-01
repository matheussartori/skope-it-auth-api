import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

export interface RefreshTokenRepository {
  findById(id: string): Promise<RefreshToken | null>
  findByToken(token: string): Promise<RefreshToken | null>
  create(refreshToken: RefreshToken): Promise<void>
  revoke(id: string): Promise<void>
}
