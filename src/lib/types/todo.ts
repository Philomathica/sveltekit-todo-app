export type Todo = {
  _id: string;
  userId: string;
  text: string;
  completed: boolean;
};

export type TodoInput = Omit<Todo, '_id' | 'userId'>;
