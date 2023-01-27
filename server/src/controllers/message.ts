import { RequestHandler } from "express";
import MessageModel from "../models/message";
import createHttpError from "http-errors";
import mongoose from "mongoose";

interface RequestParams {
  username: string
}

export const getMessagesByDestination: RequestHandler<RequestParams, unknown, unknown, unknown> = async (request, responce, next) => {
  const destination = request.params.username;
  try {
    if (!destination) throw createHttpError(400, "Invalid destination username.");
    const messages = await MessageModel.find({ destination: destination }).select("+sender +sentAt +title +message").exec();
    if (!messages) throw createHttpError(404, "No messages found.");
    responce.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

interface SenderRequestParams {
  username: string,
  sender: string
}

export const getMessagesBySender: RequestHandler<SenderRequestParams, unknown, unknown, unknown> = async (request, responce, next) => {
  const destination = request.params.username;
  const sender = request.params.sender;
  try {
    if (!sender) throw createHttpError(400, "Invalid sender username.");
    const messages = await MessageModel.find({ sender: sender }).select("+destination +sentAt +title +message").exec();
    if (!messages) throw createHttpError(404, "No messages found.");
    const relevantMessages = messages.filter(el => el.destination === destination);
    if (relevantMessages.length < 1) throw createHttpError(404, "No messages found.");
    responce.status(200).json(relevantMessages);
  } catch (error) {
    next(error);
  }
};

interface NewMessage {
  sender: string,
  destination: string,
  sentAt: string,
  title: string,
  message: string
}

export const sendMessage: RequestHandler<unknown, unknown, NewMessage, unknown> = async (request, responce, next) => {
  const sender = request.body.sender;
  const destination = request.body.destination;
  const title = request.body.title;
  const message = request.body.message;
  const sentAt = mongoose.now();
  try {
    if (!sender) throw createHttpError(400, "Sender username is required.");
    if (!destination) throw createHttpError(400, "Destination username is required.");
    if (!title) throw createHttpError(400, "Title is required.");
    if (!message) throw createHttpError(400, "Message is required.");
    
    const newMessage = await MessageModel.create({
      sender: sender,
      destination: destination,
      sentAt: sentAt,
      title: title,
      message: message
    });

    responce.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};