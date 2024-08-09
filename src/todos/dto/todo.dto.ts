export class CreateTodoDto {
    userId: number;
    title: string;
  }
  
  export class UpdateTodoDto {
    title?: string;
  }