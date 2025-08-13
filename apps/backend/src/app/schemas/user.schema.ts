import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  auth0Id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  picture?: string;

  @Prop({ default: 10000 })
  monthlyExpenseLimit: number;

  @Prop({ default: 'LKR' })
  currency: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 