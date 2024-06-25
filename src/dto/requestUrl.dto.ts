import { IsNotEmpty, IsNumber } from "class-validator";

export class RequestUrlBody {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  password: string;

  expiresIn?: number;
}

export class MaskedUrlData {
  target: string;
  link: string;
  valid: boolean;
  redirections: number;
  password: string;
  expiresAt?: Date;
}
