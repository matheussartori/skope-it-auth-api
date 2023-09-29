import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Attributes> {
  private _id: UniqueEntityID
  protected attributes: Attributes

  get id(): UniqueEntityID {
    return this._id
  }

  protected constructor(attributes: Attributes, id?: UniqueEntityID) {
    this.attributes = attributes
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity?: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity?.id === this._id) {
      return true
    }

    return false
  }
}
