import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)

    if (user === undefined) {
      return null
    }

    return user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }
}
