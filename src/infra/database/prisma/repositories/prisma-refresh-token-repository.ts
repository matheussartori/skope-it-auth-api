import { RefreshTokenRepository } from '@/domain/application/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'
import { PrismaService } from '../prisma.service'
import { PrismaRefreshTokenMapper } from '../mappers/prisma-refresh-token-mapper'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        id,
      },
    })

    if (!refreshToken) {
      return null
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken)
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    const data = PrismaRefreshTokenMapper.toPrisma(refreshToken)

    await this.prisma.refreshToken.create({
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        id,
      },
    })
  }
}