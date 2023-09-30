import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'
import { RefreshToken as PrismaRefreshToken } from '@prisma/client'

export class PrismaRefreshTokenMapper {
  static toDomain(raw: PrismaRefreshToken): RefreshToken {
    return RefreshToken.create(
      {
        token: raw.token,
        userId: new UniqueEntityID(raw.userId),
        expiredAt: raw.expiredAt,
        userAgent: raw.userAgent,
        ipAddress: raw.ipAddress,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(refreshToken: RefreshToken): PrismaRefreshToken {
    return {
      id: refreshToken.id.toString(),
      userId: refreshToken.userId.toString(),
      token: refreshToken.token,
      expiredAt: refreshToken.expiredAt,
      ipAddress: refreshToken.ipAddress ?? null,
      userAgent: refreshToken.userAgent ?? null,
      revokedAt: refreshToken.revokedAt ?? null,
      createdAt: refreshToken.createdAt ?? null,
    }
  }
}
