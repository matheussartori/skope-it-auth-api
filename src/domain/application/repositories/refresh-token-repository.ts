export interface RefreshTokenRepository {
  create(userId: string, expiresIn: number): Promise<string>
}
