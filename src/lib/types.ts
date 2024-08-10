// src\lib\types.ts

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

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserWithPassword = User & {
  password: string;
};
