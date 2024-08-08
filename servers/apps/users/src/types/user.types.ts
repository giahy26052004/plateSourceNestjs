import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
@ObjectType()
export class ErrorTypes {
  @Field()
  message: string;
  @Field()
  code?: string;
}
@ObjectType()
export class RegisterReponse {
  @Field()
  activation_token: string;
  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes | null;
}
@ObjectType()
export class ActivationResponse {
  @Field(() => User)
  user: User | any;
  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes | null;
}
@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes;
}
@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes;
}
@ObjectType()
export class FogotPasswordReponse {
  @Field()
  message: string;
  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes | null;
}
@ObjectType()
export class ResetPasswordReponse {
  @Field(()=>User)
  user: User | any;
  @Field(() => ErrorTypes, { nullable: true })
  error?: ErrorTypes | null;
}
