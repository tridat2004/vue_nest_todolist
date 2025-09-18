<template>
  <div>
    <h1>My App</h1>
    <nav>
      <router-link to="/">Todo</router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </nav>

    <!-- chỗ này sẽ render Todo.vue -->
    <router-view  />
  </div>
</template>

<script>
import TodoInput from './components/TodoInput.vue';
import TodoList from './components/TodoList.vue';
import TodoItem from './components/TodoItem.vue';
export default {

  name: 'App',
  component : {
    TodoInput,
    TodoList,
    TodoItem
},}
</script>

<style>
/* Có thể để style chung ở đây */
</style>
