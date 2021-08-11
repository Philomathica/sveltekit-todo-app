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
  import type { Todo } from '$lib/types/todo';

  export let todos: Todo[];
</script>

<ul>
  {#each todos as todo (todo.id)}
    <div class="flex items-center gap-2">
      <input type="checkbox" bind:checked={todo.completed} disabled />
      <li>{todo.text}</li>
    </div>
  {/each}
</ul>
