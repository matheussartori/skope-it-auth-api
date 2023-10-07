import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RefreshTokenAttributes {
  userId: UniqueEntityID
  token: string
  expiredAt: Date
  createdAt?: Date
  userAgent?: string | null
  ipAddress?: string | null
  revokedAt?: Date | null
}

export class RefreshToken extends Entity<RefreshTokenAttributes> {
  get token() {
    return this.attributes.token
  }

  get userId() {
    return this.attributes.userId
  }

  get expiredAt() {
    return this.attributes.expiredAt
  }

  get createdAt() {
    return this.attributes.createdAt
  }

  get userAgent() {
    return this.attributes.userAgent
  }

  get ipAddress() {
    return this.attributes.ipAddress
  }

  get revokedAt() {
    return this.attributes.revokedAt
  }

  public isExpired() {
    return this.expiredAt.getTime() < new Date().getTime()
  }

  public isRevoked() {
    if (this.revokedAt !== undefined && this.revokedAt !== null) {
      return this.revokedAt.getTime() < new Date().getTime()
    }

    return false
  }

  static create(attributes: RefreshTokenAttributes, id?: UniqueEntityID) {
    const token = new RefreshToken(
      {
        createdAt: new Date(),
        ...attributes,
      },
      id,
    )

    return token
  }
}
