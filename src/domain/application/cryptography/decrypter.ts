export abstract class Decrypter {
  abstract decrypt(accessToken: string): Promise<Record<string, unknown>>
}
