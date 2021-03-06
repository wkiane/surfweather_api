import { Controller, Post, Get, Middleware } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/app/models/user';
import { BaseController } from '.';
import AuthService from '../services/auth';
import { authMiddleware } from '@src/app/middlewares/auth';

export interface UserResponse {
  name: string;
  email: string;
  password?: string;
}

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!'
      });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!'
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me (req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await User.findOne({ email }) as UserResponse;

    user && delete user.password;

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!'
      });
    }

    return res.send({ user });
  }
}
