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

  create(refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken)

    return Promise.resolve()
  }

  async delete(id: string): Promise<void> {
    const updatedItems = this.items.filter(
      (refreshToken) => refreshToken.id.toString() !== id,
    )

    this.items = updatedItems
  }
}
