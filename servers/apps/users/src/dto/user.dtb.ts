import { InputType, Field } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from "class-validator";

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name is need to be one string" })
  name: string;
  @Field()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email is not valid" })
  email: string;
  @Field()
  @IsString({ message: "Phone number needs to be a string" })
  phone_number: string;
  @Field()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email is not valid" })
  email: string;
  @Field()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: "ActivationToken is required" })
  activationToken: string;
  @Field()
  @IsNotEmpty({ message: "ActivationCode is required" })
  activationCode: string;
}
@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email is not valid" })
  email: string;
}
@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string;
  @Field()
  @IsNotEmpty({ message: "ActivationToken is required" })
  activationToken: string;
}