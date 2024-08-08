import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
}
