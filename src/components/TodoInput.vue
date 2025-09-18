<template>
  <div class="todo-input-container">
    <div class="input-wrapper">
      <i class="fas fa-plus input-icon"></i>
      <input 
        v-model="newTask" 
        @keyup.enter="submitTask"
        @input="handleInput"
        placeholder="What needs to be done?"
        class="task-input"
        :disabled="loading"
      />
      <div class="input-border"></div>
    </div>
    
    <button 
      @click="submitTask" 
      :disabled="!canSubmit || loading"
      class="add-btn"
    >
      <span v-if="loading" class="loading-spinner"></span>
      <i v-else class="fas fa-arrow-right"></i>
      {{ loading ? 'Adding...' : 'Add Task' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTask: '',
    }
  },
  computed: {
    canSubmit() {
      return this.newTask.trim().length > 0
    }
  },
  methods: {
    submitTask() {
      if (!this.canSubmit || this.loading) return
      
      this.$emit('add-task', this.newTask.trim())
      this.newTask = ''
    },
    handleInput() {
      // Optional: Add character limit or validation here
      if (this.newTask.length > 200) {
        this.newTask = this.newTask.substring(0, 200)
      }
    }
  }
}
</script>

<style scoped>
.todo-input-container {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.todo-input-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e0;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.task-input {
  width: 100%;
  padding: 18px 18px 18px 50px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 1.1rem;
  background: #f8fafc;
  color: #2d3748;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.task-input::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.task-input:focus {
  outline: none;
  background: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.task-input:focus + .input-border {
  opacity: 1;
  transform: scaleX(1);
}

.task-input:focus ~ .input-icon {
  color: #667eea;
  transform: translateY(-50%) scale(1.1);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.task-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #e2e8f0;
}

.add-btn {
  padding: 18px 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.add-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.add-btn:hover::before {
  left: 100%;
}

.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.add-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .todo-input-container {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .add-btn {
    min-width: auto;
    padding: 16px 24px;
  }
  
  .task-input {
    font-size: 1rem;
    padding: 16px 16px 16px 46px;
  }
}

@media (max-width: 480px) {
  .todo-input-container {
    margin-bottom: 30px;
    padding: 16px;
  }
  
  .task-input {
    padding: 14px 14px 14px 42px;
  }
  
  .add-btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}
</style>