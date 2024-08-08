import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import {
  ActivationResponse,
  FogotPasswordReponse,
  LoginResponse,
  LogoutResponse,
  RegisterReponse,
  ResetPasswordReponse,
} from "./types/user.types";
import {
  ActivationDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/user.dtb";
import { Request, Response } from "express";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { AuthGuard } from "./guards/auth.guard";

@Resolver("User")
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterReponse)
  async register(
    @Args("registerDto") registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterReponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException("Please fill all fields fields");
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }
  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args("activationDto") activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.usersService.activateUser(activationDto, context.res);
  }
  @Mutation(() => LoginResponse)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
  ): Promise<LoginResponse> {
    return await this.usersService.login({ email, password });
  }
  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.usersService.Logout(context.req);
  }
  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.usersService.getLoggedInUser(context.req);
  }
  @Mutation(() => FogotPasswordReponse)
  async forgotPassword(
    @Args("forgotPasswordDto") forgotPasswordDto: ForgotPasswordDto,
  ): Promise<FogotPasswordReponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }
  @Mutation(() => ResetPasswordReponse)
  async resetPassword(
    @Args("resetPasswordDto") resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordReponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }
  @Query(() => [User])
  async getUsers() {
    return await this.usersService.getUsers();
  }
}
