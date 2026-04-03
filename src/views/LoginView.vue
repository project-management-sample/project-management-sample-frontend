<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1>📝 Memo System</h1>
        <p>ログインしてメモを管理しましょう</p>
      </header>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="demo@example.com"
            class="input"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="password"
            class="input"
            autocomplete="current-password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          ⚠️ {{ errorMessage }}
        </div>

        <button type="submit" class="submit-btn" :disabled="submitting">
          <span v-if="submitting">ログイン中...</span>
          <span v-else>ログイン</span>
        </button>
      </form>

      <p class="demo-hint">
        デモアカウント: <strong>demo@example.com</strong> / <strong>password</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const submitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'メールアドレスとパスワードを入力してください'
    return
  }

  submitting.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
    router.push({ name: 'home' })
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.message || 'ログインに失敗しました'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.login-header h1 {
  font-size: 2em;
  margin-bottom: 8px;
}

.login-header p {
  opacity: 0.9;
  font-size: 0.95em;
}

.login-form {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.9em;
  font-weight: 600;
  color: #555;
}

.input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  border-left: 4px solid #f44747;
  color: #c41e3a;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 0.9em;
}

.submit-btn {
  padding: 13px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-hint {
  text-align: center;
  font-size: 0.85em;
  color: #888;
  padding: 0 30px 20px;
}
</style>
