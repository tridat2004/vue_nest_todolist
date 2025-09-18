<template>
  <div class="todo-item" :class="{ completed: task.completed, editing: isEditing }">
    <!-- Edit Mode -->
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-input-wrapper">
        <input 
          ref="editInput"
          v-model="editText" 
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
          @blur="saveEdit"
          class="edit-input"
          placeholder="Enter task text..."
        />
      </div>
      <div class="edit-actions">
        <button @click="saveEdit" class="save-btn">
          <i class="fas fa-check"></i>
        </button>
        <button @click="cancelEdit" class="cancel-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Display Mode -->
    <div v-else class="display-mode">
      <div class="task-content">
        <div class="checkbox-wrapper" @click="toggleComplete">
          <input 
            type="checkbox" 
            :checked="task.completed" 
            @change="toggleComplete"
            class="task-checkbox"
            :id="`task-${task._id}`"
          />
          <label :for="`task-${task._id}`" class="checkbox-label">
            <i class="fas fa-check check-icon"></i>
          </label>
        </div>
        
        <div class="task-text-wrapper" @dblclick="startEdit">
          <span class="task-text" :class="{ completed: task.completed }">
            {{ task.text }}
          </span>
          <div class="task-meta">
            <span class="task-date">
              {{ formatDate(task.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="task-actions">
        <button @click="startEdit" class="action-btn edit-btn" title="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="removeTask" class="action-btn delete-btn" title="Delete task">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>

    <!-- Progress bar for completed tasks -->
    <div v-if="task.completed" class="completion-indicator"></div>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editText: this.task.text,
    }
  },
  methods: {
    toggleComplete() {
      this.$emit('toggle-task', this.task._id)
    },
    
    startEdit() {
      this.isEditing = true
      this.editText = this.task.text
      this.$nextTick(() => {
        if (this.$refs.editInput) {
          this.$refs.editInput.focus()
          this.$refs.editInput.select()
        }
      })
    },
    
    saveEdit() {
      const trimmedText = this.editText.trim()
      if (trimmedText && trimmedText !== this.task.text) {
        this.$emit('edit-task', { 
          id: this.task._id, 
          text: trimmedText 
        })
      }
      this.isEditing = false
    },
    
    cancelEdit() {
      this.isEditing = false
      this.editText = this.task.text
    },
    
    removeTask() {
      if (confirm('Are you sure you want to delete this task?')) {
        this.$emit('remove-task', this.task._id)
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return 'Today'
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else if (diffDays < 7) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString()
      }
    }
  },
  emits: ['toggle-task', 'edit-task', 'remove-task']
}
</script>

<style scoped>
.todo-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.todo-item:hover {
  background: white;
  border-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.todo-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.todo-item.completed:hover {
  border-color: #86efac;
}

.todo-item.editing {
  background: #fef3c7;
  border-color: #fbbf24;
}

.display-mode {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  margin-top: 2px;
}

.task-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-label {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: white;
  font-size: 12px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.task-checkbox:checked + .checkbox-label {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
  transform: scale(1.05);
}

.task-checkbox:checked + .checkbox-label .check-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label:hover {
  border-color: #667eea;
  transform: scale(1.05);
}

.task-text-wrapper {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  padding: 2px 0;
}

.task-text {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.5;
  word-break: break-word;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.task-text.completed {
  text-decoration: line-through;
  color: #68d391;
  opacity: 0.8;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-date {
  font-size: 0.85rem;
  color: #a0aec0;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todo-item:hover .task-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);
}

.action-btn:hover::before {
  width: 100%;
  height: 100%;
}

.edit-btn {
  background: #e6fffa;
  color: #2d3748;
  border: 1px solid #b2f5ea;
}

.edit-btn:hover {
  background: #4fd1c7;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 209, 199, 0.3);
}

.delete-btn {
  background: #fed7d7;
  color: #e53e3e;
  border: 1px solid #feb2b2;
}

.delete-btn:hover {
  background: #e53e3e;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.edit-mode {
  display: flex;
  align-items: center;
  gap: 12px;
}

.edit-input-wrapper {
  flex: 1;
}

.edit-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  background: white;
  color: #2d3748;
  transition: all 0.3s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.save-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.cancel-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}

.completion-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 0 0 14px 14px;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .todo-item {
    padding: 16px;
  }
  
  .display-mode {
    gap: 12px;
  }
  
  .task-content {
    gap: 12px;
  }
  
  .task-text {
    font-size: 1rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .task-actions {
    opacity: 1; /* Always show on mobile */
  }
}

@media (max-width: 480px) {
  .todo-item {
    padding: 12px;
  }
  
  .edit-mode {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .edit-actions {
    align-self: center;
  }
}
</style>