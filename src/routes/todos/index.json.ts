import type { RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/db';
import { ObjectId } from 'mongodb';
import type { Todo } from '$lib/todo';

export const get: RequestHandler = async ({ query }) => {
  try {
    const completed = query.get('completed') === 'true';
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todos = await collection
      .find<Todo>({ completed })
      .toArray();

    return { status: 200, body: todos };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const post: RequestHandler<Record<string, unknown>, string> = async ({ body }) => {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todo: Todo = JSON.parse(body);

    await collection.insertOne(todo);

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};

export const put: RequestHandler<Record<string, unknown>, string> = async ({ body }) => {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection<Todo>('todos');
    const todo: Todo = JSON.parse(body);
    await collection.updateOne({ _id: new ObjectId(todo._id) }, { $set: { completed: todo.completed } });

    return { status: 200, body: { status: 'Success' } };
  } catch (error) {
    console.error(error);

    return { status: 500, body: { error: 'Error' } };
  }
};
export const del: RequestHandler = async () => {
  return {};
};
