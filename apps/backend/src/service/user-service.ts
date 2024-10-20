import { Prisma, User } from '@prisma/client';
import { useAuthUser } from '../provider/async-context';
import {
  ensure,
  Maybe,
  UserLoginInput,
  UserWithRolesAndDepartment,
} from '@hospital/shared';
import { dbClient } from '../prisma';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(
    user: Prisma.UserCreateInput,
    password: string,
  ): Promise<User> {
    const reqUser = useAuthUser();
    const res = await dbClient.user.create({
      data: {
        ...user,
        updatedBy: reqUser.id,
      },
    });
    this.upsertPassword(res, password);
    return res;
  }

  async upsertPassword(user: User, password: string): Promise<string> {
    const reqUser = useAuthUser();
    const hashedPassword = await bcrypt.hash(password, 10);
    await dbClient.userLogin.create({
      data: {
        userId: user.id,
        password: hashedPassword,
        updatedBy: reqUser.id,
      },
    });
    return this.generateToken(user);
  }

  async validateByToken(
    token: string,
  ): Promise<Maybe<UserWithRolesAndDepartment>> {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return await dbClient.user.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        Department: true,
        UserRole: true,
        Hospital: true,
      },
    });
  }

  async generateToken(user: User): Promise<string> {
    return jwt.sign({ id: user.id }, JWT_SECRET);
  }

  async getUserById(id: string): Promise<Maybe<UserWithRolesAndDepartment>> {
    return await dbClient.user.findUnique({
      where: {
        id,
      },
      include: {
        Department: true,
        UserRole: true,
        Hospital: true,
      },
    });
  }

  async getUserByEmail({
    email,
    hospitalId,
  }: {
    email: string;
    hospitalId: number;
  }): Promise<Maybe<UserWithRolesAndDepartment>> {
    return await dbClient.user.findUnique({
      where: {
        email_hospitalId: {
          email,
          hospitalId,
        },
      },
      include: {
        Department: true,
        UserRole: true,
        Hospital: true,
      },
    });
  }

  async loginWithPassword(param: UserLoginInput): Promise<string> {
    const user = await this.getUserByEmail({
      email: param.email,
      hospitalId: param.hospitalId,
    });
    ensure(user, 'User not found');
    const userLogin = await dbClient.userLogin.findFirst({
      where: {
        userId: user.id,
      },
    });
    ensure(userLogin, `Contact admin to reset password`);
    const isPasswordValid = await bcrypt.compare(
      param.password,
      userLogin.password,
    );
    console.log({ isPasswordValid });
    ensure(isPasswordValid, 'Invalid password');
    return this.generateToken(user);
  }
}

export const userService = new UserService();
