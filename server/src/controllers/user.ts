import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";

export const getUser: RequestHandler = async (request, response, next) => {
  const username = request.body.username;
  try {
    if (!username) throw createHttpError(400, "Username required.")
    const user = await UserModel.findOne({ username: username }).exec();
    if (!user) {
      const newUser = await UserModel.create({
        username: username
      });
      response.status(201).json(newUser.username);
    } else {
      response.status(200).json(user.username);
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (request, response, next) => {
  try {
    const users = await UserModel.find().exec();
    if (!users) throw createHttpError(404, "No users found.");
    const usernames: string[] = [];
    users.forEach(el => usernames.push(el.username));
    response.status(200).json(usernames);
  } catch (error) {
    next(error);
  }
};