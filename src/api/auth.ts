import client from "./client";

export const login = async (name: string, email: string) => {
  const response = await client.post("/auth/login", { name, email });
  return response;
};

export const logout = async () => {
  await client.post("/auth/logout");
};
