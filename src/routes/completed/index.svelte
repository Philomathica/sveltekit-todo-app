<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/todos.json?completed=true');

    if (res.ok) {
      const todos: Todo[] = await res.json();

      return { props: { todos } };
    }

    const { message } = await res.json();

    return { error: new Error(message) };
  };
</script>

<script lang="ts">
  import type { Todo, TodoInput } from '$lib/todo';

  export let todos: Todo[];
  let text = '';

  async function addTodo() {
    try {
      const todo: TodoInput = { text, completed: false };
      await fetch('/todos.json', { method: 'POST', body: JSON.stringify(todo) });
      text = '';
      fetchTodo();
    } catch (error) {
      alert(error);
      text = '';
    }
  }

  async function completeTodo(todo: Todo) {
    try {
      await fetch('/todos.json', { method: 'PUT', body: JSON.stringify(todo) });
      fetchTodo();
    } catch (error) {
      alert('There was an error');
      text = '';
    }
  }

  async function fetchTodo() {
    const res = await fetch('/todos.json');
    todos = await res.json();
  }
</script>

<h1 class="text-6xl">Completed Todos</h1>
<input class="border" type="text" bind:value={text} />
<button on:click={addTodo}>Add Todo</button>

<ul>
  {#each todos as todo (todo._id)}
    <div class="flex items-center gap-2">
      <input type="checkbox" bind:checked={todo.completed} disabled />
      <li>{todo.text}</li>
    </div>
  {/each}
</ul>
