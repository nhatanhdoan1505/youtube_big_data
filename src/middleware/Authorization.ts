import { auth } from "firebase-admin";
import { UserService } from "../models/user/service";
import { app } from "../firebase/config";

export class Middleware {
  private userService: UserService = new UserService();

  async authorization(req, res, next) {
    try {
      if (!req.headers.authorization) next();
      const { uid } = await auth(app).verifyIdToken(req.headers.authorization);
      const user = await this.userService.findUser({ uid });
      if (!user) next();
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next();
    }
  }
}
