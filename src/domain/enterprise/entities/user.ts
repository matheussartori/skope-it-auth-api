import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserAttributes {
  name: string
  email: string
  password: string
  emailVerifiedAt?: Date
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
