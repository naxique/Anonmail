import { Message } from "../models/Message";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const responce = await fetch("http://localhost:5000"+input, {...init, credentials: 'include'});
  if (responce.ok) {
    return responce
  } else {
    const errorBody = await responce.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export async function getUser(username: string): Promise<string> {
  let responce = await fetchData("/api/", { 
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username })
  });
  return responce.json();
}

interface NewMessage {
  sender: string,
  destination: string,
  title: string,
  message: string
}

export async function newMessage(message: NewMessage): Promise<Message> {
  const responce = await fetchData("/api/msg/", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
  return responce.json();
}

export async function getAllUsers(): Promise<string[]> {
  const responce = await fetchData("/api/", { method: "GET" });
  return responce.json();
}

export async function getMessages(username: string): Promise<Message[]> {
  const responce = await fetchData("/api/msg/d/"+username, { method: "GET" });
  return responce.json();
}

export async function getSenderMessages(username: string, sender: string): Promise<Message[]> {
  const responce = await fetchData("/api/msg/d/"+username+"/"+sender, { method: "GET" });
  return responce.json();
}