import { UseCaseError } from '../use-case-error'

export class NotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Not found')
  }
}
