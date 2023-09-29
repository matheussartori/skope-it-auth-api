import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface TokenAttributes {
  userId: UniqueEntityID
  token: string
  expiredAt: Date
  createdAt: Date
  userAgent?: string
  ipAddress?: string
  revokedAt?: Date
}

export class RefreshToken extends Entity<TokenAttributes> {
  static create(attributes: TokenAttributes, id?: UniqueEntityID) {
    const token = new RefreshToken(attributes, id)

    return token
  }
}
