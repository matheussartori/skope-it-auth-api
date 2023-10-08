import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'

export interface UserAttributes {
  name: string
  email: string
  password: string
  emailVerifiedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export class User extends Entity<UserAttributes> {
  get name() {
    return this.attributes.name
  }

  get email() {
    return this.attributes.email
  }

  get password() {
    return this.attributes.password
  }

  async updatePassword(password: string, hashGenerator: HashGenerator) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(password)) {
      this.attributes.password = await hashGenerator.hash(password)
    } else {
      throw new Error(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.',
      )
    }
  }

  get createdAt() {
    return this.attributes.createdAt
  }

  get updatedAt() {
    return this.attributes.updatedAt
  }

  get emailVerifiedAt() {
    return this.attributes.emailVerifiedAt
  }

  static create(attributes: UserAttributes, id?: UniqueEntityID) {
    const user = new User(
      {
        ...attributes,
        createdAt: new Date(),
      },
      id,
    )

    return user
  }
}
