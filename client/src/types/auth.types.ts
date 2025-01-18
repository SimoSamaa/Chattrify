interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  picture: string;
  token: string;
}

interface AuthInitialState {
  user: User;
}

export type { User, AuthInitialState };