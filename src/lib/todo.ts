export type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};

export type TodoInput = Omit<Todo, '_id'>;
