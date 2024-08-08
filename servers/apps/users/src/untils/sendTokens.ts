import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
export class TokenSender {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  public sendToken(user: User) {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "15m",
      },
    );
    const refreshToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "3d",
      },
    );
    return { user, accessToken, refreshToken };
  }
}
