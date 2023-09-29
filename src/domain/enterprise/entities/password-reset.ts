import { Entity } from '@/core/entities/entity'

interface PasswordResetAttributes {
  email: string
  token: string
  sendAt: Date
  usedAt?: Date
  expiredAt: Date
}

export class PasswordReset extends Entity<PasswordResetAttributes> {
  static create(attributes: PasswordResetAttributes) {
    const passwordReset = new PasswordReset(attributes)

    return passwordReset
  }
}
