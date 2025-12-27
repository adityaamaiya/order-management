import httpStatus from "http-status";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";

export class UserService {
  async getById(userId: string) {
    const user = await User.findById(userId).select(
      "_id name email role isActive createdAt"
    );
    if (!user) {
      throw new AppError("User does not exist", httpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAll() {
    const users = await User.find().select("-password");
    return users;
  }

  async deactivateUser(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError("User does not exist", httpStatus.NOT_FOUND);
    }

    return user;
  }
}
