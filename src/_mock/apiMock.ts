import { DB_USER, DB_MENU, DB_ROLE, DB_PERMISSION, DB_USER_ROLE, DB_ROLE_PERMISSION } from "./assets_backup"; // your DB file
import type { User, Menu } from "#/entity";

// simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiMock = {
  login: async (username: string, password: string): Promise<User> => {
    await delay(500); // simulate network delay
    const user = DB_USER.find(u => u.username === username && u.password === password);
    if (!user) throw new Error("Invalid username or password");
    return user;
  },

  getMenus: async (): Promise<Menu[]> => {
    await delay(300);
    return DB_MENU;
  },

  getUsers: async () => {
    await delay(300);
    return DB_USER;
  },

  getRoles: async () => {
    await delay(300);
    return DB_ROLE;
  },

  getPermissions: async () => {
    await delay(300);
    return DB_PERMISSION;
  },

  // You can add more mock endpoints as needed
};
