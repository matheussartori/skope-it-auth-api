import { RefreshTokenRepository } from '@/domain/application/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/enterprise/entities/refresh-token'

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  public items: RefreshToken[] = []

  async findById(id: string): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(
      (refreshToken) => refreshToken.id.toString() === id,
    )

    if (refreshToken === undefined) {
      return null
    }

    return refreshToken
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(
      (refreshToken) => refreshToken.token === token,
    )

    if (refreshToken === undefined) {
      return null
    }

    return refreshToken
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken)
  }

  async revoke(id: string): Promise<void> {
    const updatedItems = this.items.map((refreshToken) => {
      if (refreshToken.id.toString() === id) {
        return {
          ...refreshToken,
          revokedAt: new Date(),
        } as RefreshToken
      }

      return refreshToken
    })

    this.items = updatedItems
  }
}
