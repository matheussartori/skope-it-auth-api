import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

export class RefreshTokenPresenter {
  static toHTTP(refreshToken: RefreshToken) {
    return {
      id: refreshToken.id.toString(),
      userId: refreshToken.userId.toString(),
      createdAt: refreshToken.createdAt,
      expiredAt: refreshToken.expiredAt,
      userAgent: refreshToken.userAgent,
      ipAddress: refreshToken.ipAddress,
      revokedAt: refreshToken.revokedAt,
    }
  }
}
