import { User } from '@/domain/enterprise/entities/user'

export abstract class UserRepository {
  abstract findById(id): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
}
