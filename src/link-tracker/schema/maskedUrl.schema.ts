import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ItemsDocument = MaskedUrl & Document;

@Schema()
export class MaskedUrl {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  valid: boolean;

  @Prop({ required: true, default: 0 })
  redirections: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  expiresAt?: Date;
}

export const MaskedUrlSchema = SchemaFactory.createForClass(MaskedUrl);
