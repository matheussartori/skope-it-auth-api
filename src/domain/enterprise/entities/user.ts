import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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
