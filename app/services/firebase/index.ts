interface User {
  id: string;
  email: string;
}

async function login(): Promise<User> {
  return { id: "1", email: "leo@mail.com" };
}

export const Firebase = {
  login,
};
