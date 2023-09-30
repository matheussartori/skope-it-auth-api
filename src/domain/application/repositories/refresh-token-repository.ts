import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

export interface RefreshTokenRepository {
  findById(id: string): Promise<RefreshToken | null>
  create(refreshToken: RefreshToken): Promise<void>
  delete(id: string): Promise<void>
}
