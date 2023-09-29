import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserAttributes } from '@/domain/enterprise/entities/user'
import { faker } from '@faker-js/faker'

export function makeUser(
  override?: Partial<UserAttributes>,
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}
