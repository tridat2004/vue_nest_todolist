<template>
  <div class="todo-app">
    <div class="app-container">
      <!-- Header Section -->
      <div class="app-header">
        <h1 class="app-title">
          <i class="fas fa-check-circle"></i>
          My Todo List
        </h1>
        <p class="app-subtitle">Stay organized and productive</p>
      </div>

      <!-- Input Section -->
      <TodoInput @add-task="addTask" :loading="isAddingTask" />

      <!-- Main Content -->
      <div class="main-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your tasks...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="tasks.length === 0" class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>No tasks yet</h3>
          <p>Add your first task to get started!</p>
        </div>

        <!-- Tasks Section -->
        <div v-else class="tasks-section">
          <div class="tasks-header">
            <div class="tasks-stats">
              <span class="total-tasks">{{ tasks.length }} tasks</span>
              <span class="completed-tasks">{{ completedCount }} completed</span>
            </div>
            <button 
              v-if="completedCount > 0"
              @click="clearCompleted"
              class="clear-completed-btn"
            >
              <i class="fas fa-trash"></i>
              Clear Completed
            </button>
          </div>

          <!-- Tasks List -->
          <TodoList
            :tasks="tasks"
            @remove-task="removeTask"
            @toggle-task="toggleTask"
            @edit-task="editTask"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodoInput from '../components/TodoInput.vue'
import TodoList from '../components/TodoList.vue'
import api from '../services/api.js'

export default {
  name: 'TodoView',
  components: { 
    TodoInput, 
    TodoList 
  },
  data() {
    return {
      tasks: [],
      loading: true,
      isAddingTask: false,
    }
  },
  computed: {
    completedCount() {
      return this.tasks.filter(task => task.completed).length
    }
  },
  methods: {
    // Fetch all tasks from API
    async fetchTasks() {
      try {
        this.loading = true
        const response = await api.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        console.error('Error fetching tasks:', error)
        this.showNotification('Error loading tasks', 'error')
      } finally {
        this.loading = false
      }
    },
    
    // Add new task
    async addTask(title) {
      try {
        this.isAddingTask = true
        const response = await api.post('/tasks', { text: title })
        this.tasks.unshift(response.data)
        this.showNotification('Task added successfully!', 'success')
      } catch (error) {
        console.error('Error adding task:', error)
        this.showNotification('Failed to add task', 'error')
      } finally {
        this.isAddingTask = false
      }
    },
    
    // Remove task
    async removeTask(id) {
      try {
        await api.delete(`/tasks/${id}`)
        this.tasks = this.tasks.filter(task => task._id !== id)
        this.showNotification('Task removed', 'success')
      } catch (error) {
        console.error('Error removing task:', error)
        this.showNotification('Failed to remove task', 'error')
      }
    },
    
    // Toggle task completion
    async toggleTask(id) {
      try {
        const task = this.tasks.find(t => t._id === id)
        if (task) {
          const response = await api.put(`/tasks/${id}`, {
            text: task.text,
            completed: !task.completed,
          })
          this.tasks = this.tasks.map(t => (t._id === id ? response.data : t))
        }
      } catch (error) {
        console.error('Error toggling task:', error)
        this.showNotification('Failed to update task', 'error')
      }
    },
    
    // Edit task
    async editTask(data) {
      try {
        const response = await api.put(`/tasks/${data.id}`, { text: data.text })
        this.tasks = this.tasks.map(t => (t._id === data.id ? response.data : t))
        this.showNotification('Task updated!', 'success')
      } catch (error) {
        console.error('Error editing task:', error)
        this.showNotification('Failed to update task', 'error')
      }
    },
    
    // Clear all completed tasks
    async clearCompleted() {
      const completedTasks = this.tasks.filter(task => task.completed)
      
      if (!confirm(`Are you sure you want to delete ${completedTasks.length} completed tasks?`)) {
        return
      }

      try {
        await Promise.all(
          completedTasks.map(task => api.delete(`/tasks/${task._id}`))
        )
        this.tasks = this.tasks.filter(task => !task.completed)
        this.showNotification(`${completedTasks.length} tasks cleared`, 'success')
      } catch (error) {
        console.error('Error clearing completed tasks:', error)
        this.showNotification('Failed to clear tasks', 'error')
      }
    },
    
    // Show notification
    showNotification(message, type = 'info') {
      const notification = document.createElement('div')
      notification.className = `notification ${type}`
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-${this.getNotificationIcon(type)}"></i>
          <span>${message}</span>
        </div>
      `
      
      document.body.appendChild(notification)
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 3000)
    },
    
    // Get notification icon based on type
    getNotificationIcon(type) {
      const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
      }
      return icons[type] || 'info-circle'
    }
  },
  
  // Load tasks when component mounts
  mounted() {
    this.fetchTasks()
  },
  
  // Set page title
  created() {
    document.title = 'Todo List - Stay Organized'
  }
}
</script>

<style scoped>
.todo-app {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-container {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header Styles */
.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  font-size: 3rem;
  color: #2d3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.app-title i {
  color: #667eea;
  font-size: 2.5rem;
}

.app-subtitle {
  color: #718096;
  font-size: 1.2rem;
  font-weight: 500;
}

/* Main Content */
.main-content {
  min-height: 400px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 24px;
}

.empty-state h3 {
  color: #4a5568;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.empty-state p {
  color: #718096;
  font-size: 1.1rem;
}

/* Tasks Section */
.tasks-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.tasks-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.total-tasks {
  color: #4a5568;
  font-weight: 700;
  font-size: 1.1rem;
}

.completed-tasks {
  color: #10b981;
  font-weight: 600;
  font-size: 0.95rem;
  background: #d1fae5;
  padding: 4px 12px;
  border-radius: 12px;
}

.clear-completed-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-completed-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .todo-app {
    padding: 10px;
  }
  
  .app-container {
    padding: 20px;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .tasks-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .tasks-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .app-title i {
    font-size: 2rem;
  }
}
</style>

<style>
/* Global notification styles (không scoped) */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  animation: slideInRight 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.notification.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.notification.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.notification.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  gap: 12px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .notification {
    left: 10px;
    right: 10px;
    min-width: auto;
  }
}
</style>