import type { RequestHandler } from '@sveltejs/kit';
import type { Todo } from '$lib/types/todo';
import type { Locals } from '$lib/types/locals';
import { v4 as uuid } from 'uuid';

const todos: Todo[] = [];

export const get: RequestHandler<Locals> = ({ locals, query }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const completed = query.get('completed') === 'true';
    const filteredTodos: Todo[] = todos.filter(todo => todo.completed === completed && todo.userId === locals.userid);

    return { status: 200, body: filteredTodos };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const post: RequestHandler<Locals, string> = ({ locals, body }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const todo: Todo = JSON.parse(body);

    if (!todo.text) {
      return { status: 304 };
    }

    todos.push({ ...todo, userId: locals.userid, id: uuid() });

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const put: RequestHandler<Locals, string> = ({ locals, body }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const todo: Todo = JSON.parse(body);
    const todoIndex = todos.findIndex(t => t.id === todo.id && todo.userId === locals.userid);
    todos[todoIndex] = { ...todos[todoIndex], completed: todo.completed };

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const del: RequestHandler<Locals> = ({ locals }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  return {};
};
