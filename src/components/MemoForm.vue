<template>
  <div class="memo-form-container">
    <h2>新しいメモを作成</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="memo-text">メモの内容</label>
        <textarea
          id="memo-text"
          v-model="formData.text"
          placeholder="ここにメモを入力してください..."
          class="textarea"
          rows="4"
          maxlength="1000"
        ></textarea>
        <div class="char-count">
          {{ formData.text.length }} / 1000
        </div>
      </div>

      <div v-if="validationError" class="validation-error">
        ⚠️ {{ validationError }}
      </div>

      <button
        type="submit"
        class="submit-btn"
        :disabled="!isFormValid || submitting"
      >
        <span v-if="submitting">作成中...</span>
        <span v-else>✨ メモを作成</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemoStore } from '@/stores/memos'

const memoStore = useMemoStore()

const formData = ref({
  text: '',
})

const submitting = ref(false)
const validationError = ref('')

const emit = defineEmits<{
  created: []
}>()

const isFormValid = computed(() => {
  return formData.value.text.trim().length > 0
})

const handleSubmit = async () => {
  validationError.value = ''

  // バリデーション
  if (!formData.value.text.trim()) {
    validationError.value = 'メモの内容を入力してください'
    return
  }

  if (formData.value.text.trim().length < 1) {
    validationError.value = 'メモは1字以上で作成してください'
    return
  }

  submitting.value = true

  try {
    await memoStore.createMemo(formData.value.text)
    formData.value.text = ''
    emit('created')
  } catch (error) {
    validationError.value = 'メモの作成に失敗しました'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.memo-form-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.memo-form-container h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.3em;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1em;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.char-count {
  font-size: 0.85em;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.validation-error {
  background: #fee;
  color: #c41e3a;
  padding: 10px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.95em;
}

.submit-btn {
  width: 100%;
  padding: 12px;
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

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}
</style>
