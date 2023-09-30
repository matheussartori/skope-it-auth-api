import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  RefreshToken,
  RefreshTokenAttributes,
} from '@/domain/enterprise/entities/refresh-token'
import { faker } from '@faker-js/faker'

export function makeRefreshToken(
  override?: Partial<RefreshTokenAttributes>,
  id?: UniqueEntityID,
) {
  const expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() + 1)

  const user = RefreshToken.create(
    {
      token: faker.string.uuid(),
      userId: new UniqueEntityID(faker.string.uuid()),
      expiredAt,
      userAgent: faker.internet.userAgent(),
      ipAddress: faker.internet.ip(),
      ...override,
    },
    id,
  )

  return user
}
