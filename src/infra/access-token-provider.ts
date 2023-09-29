export interface AccessTokenProvider {
  generate(payload: string): Promise<string>
  verify(token: string): Promise<string>
}
