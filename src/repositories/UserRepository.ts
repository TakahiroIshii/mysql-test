import { singleton } from "tsyringe";
import { MySQL } from "../clients";
import { User } from "../entities";
import { Repository } from "typeorm";

@singleton()
export class UserRepository {
  private repository: Repository<User>;
  constructor(private readonly mySql: MySQL) {}
  async init() {
    this.repository = this.mySql.getRepository(User);
  }

  async insert(id: User["id"]) {
    const newUser = new User();
    newUser.id = id;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.age = 2;
    await this.repository.save(newUser);
  }
}
