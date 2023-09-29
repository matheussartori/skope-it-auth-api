export interface RefreshTokenProvider {
  generate(): Promise<string>
}
