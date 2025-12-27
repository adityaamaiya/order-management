import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { LoginUserDTO, SignUpUserDTO } from "../validations/auth.validation";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export class AuthService {
  async register(userData: SignUpUserDTO) {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new AppError("User already exists", httpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      Number(process.env.BCRYPT_SALT) || 10
    );

    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return userResponse;
  }

  async login(credentials: LoginUserDTO) {
    const user = await User.findOne({ email: credentials.email }).select(
      "+password"
    );

    if (!user) {
      throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError("User is not active", httpStatus.FORBIDDEN);
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password!);

    if (!isMatch) {
      throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
