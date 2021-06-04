import { injectable } from "tsyringe";

import { Post } from "./decorators";
import { UserRepository } from "../repositories";

interface UserRequest {
  id: string;
}

@injectable()
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Post("/user")
  async insertUser({ id }: UserRequest) {
    await this.userRepository.insert(id);
  }
}
