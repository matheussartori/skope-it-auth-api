import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPasswordError extends Error implements UseCaseError {
  constructor() {
    super(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.',
    )
  }
}
