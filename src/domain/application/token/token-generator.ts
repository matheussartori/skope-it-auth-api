export abstract class TokenGenerator {
  abstract create(): Promise<string>
}
