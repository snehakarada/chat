export interface Chat {
  from: string;
  to: string;
  msg: string;
}

export interface UserInfo {
  username: string;
  password: string;
  frnds: string[];
  chats: {};
}

export interface message {
  from: string;
  to: string;
  message: string;
}
