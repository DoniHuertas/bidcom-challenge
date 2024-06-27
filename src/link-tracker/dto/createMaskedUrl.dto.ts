export class CreateMaskedUrlDto {
  target: string;
  link: string;
  valid: boolean;
  redirections: number;
  password: string;
  expiresAt?: Date;
}
