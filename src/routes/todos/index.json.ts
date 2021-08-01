import type { RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/db/mongo';
import { ObjectId } from 'mongodb';
import type { Todo } from '$lib/types/todo';
import type { Locals } from '$lib/types/locals';

export const get: RequestHandler<Locals> = async ({ locals, query }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const completed = query.get('completed') === 'true';
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todos = await collection
      .find<Todo>({ completed, userId: locals.userid })
      .toArray();

    return { status: 200, body: todos };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const post: RequestHandler<Locals, string> = async ({ locals, body }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todo: Todo = JSON.parse(body);

    await collection.insertOne({ ...todo, userId: locals.userid });

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const put: RequestHandler<Locals, string> = async ({ locals, body }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todo: Todo = JSON.parse(body);
    await collection.updateOne({ _id: new ObjectId(todo._id), userId: locals.userid }, { $set: { completed: todo.completed } });

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const del: RequestHandler<Locals> = async ({ locals }) => {
  if (!locals.userid) {
    return { status: 401 };
  }

  return {};
};
