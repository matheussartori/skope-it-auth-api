import { randomUUID } from 'crypto'

export class UniqueEntityID {
  private value: string

  toString(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return id.toString() === this.value
  }
}
