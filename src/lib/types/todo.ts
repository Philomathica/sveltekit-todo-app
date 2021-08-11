export type Todo = {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
};

export type TodoInput = Omit<Todo, 'id' | 'userId'>;
