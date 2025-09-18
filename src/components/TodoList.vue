<template>
  <div class="todo-list">
    <TransitionGroup name="task-list" tag="div">
      <TodoItem 
        v-for="task in tasks" 
        :key="task._id"
        :task="task"
        @remove-task="$emit('remove-task', $event)"
        @toggle-task="$emit('toggle-task', $event)"
        @edit-task="$emit('edit-task', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoList',
  components: { TodoItem },
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['remove-task', 'toggle-task', 'edit-task']
}
</script>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Animation for task list */
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}
</style>