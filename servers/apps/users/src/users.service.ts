import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/user.dtb";
import { PrismaService } from "../../../prisma/Prisma.service";
import { Response } from "express";
import * as brypt from "bcrypt";
import { EmailService } from "./email/email.service";
import { TokenSender } from "./untils/sendTokens";
import { User } from "@prisma/client";
interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}
  ///register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException("User already exist with this email ");
    }
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (isPhoneNumberExist) {
      throw new BadRequestException("Phone number already exists");
    }
    const hashedPassword = await brypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };
    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendEmail({
      email,
      subject: "Food Delivery Activation Code",
      name,
      activationCode,
      template: "./activation-mail",
    });
    return { activation_token, response };
  }
  ///create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const payload = { user, activationCode };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("ACTIVATION_SECRET"),
      expiresIn: "5m",
    });
    return { token, activationCode };
  }
  ///activation user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;
    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>("ACTIVATION_SECRET"),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };
    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException("Invalid activation code");
    }
    const { name, email, password, phone_number } = newUser.user;
    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      throw new BadRequestException("User already exist with this email");
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });
    return { user, response };
  }
  ///login user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refeshtoken: null,
        error: {
          message: "Invalid email or password",
        },
      };
    }
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await brypt.compare(password, hashedPassword);
  }
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>("FORGOT_PASSWORD_SECRET"),
        expiresIn: "10m",
      },
    );
    return forgotPasswordToken;
  }

  //fogot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException("User not found");
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl =
      this.configService.get<string>("CLIENT_SIDE_URI") +
      `/reset-password?verify=${forgotPasswordToken}`;
    await this.emailService.sendEmail({
      email,
      subject: "Reset Your Password!",
      name: user.name,
      template: "./forgot-password",
      activationCode: resetPasswordUrl,
    });
    return { message: "forgot password request successfull!" };
  }
  //reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;
    const decode = await this.jwtService.decode(activationToken);
    if (!decode || decode?.exp * 1000 < Date.now()) {
      throw new BadRequestException("Invalid activationToken");
    }
    const hashedPassword = await brypt.hash(password, 10);
    const user = await this.prisma.user.update({
      where: { id: decode.user.id },
      data: { password: hashedPassword },
    });
    return { user };
  }

  //get user logged
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }
  //logout user
  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: "logout successfully" };
  }
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
