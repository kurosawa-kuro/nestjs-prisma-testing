// src\types\index.ts

export type PaginatedResult<T = any> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
};

export type UserPaginatedResult = PaginatedResult<Partial<User>>;

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithPassword = User & {
  password: string;
};
