<template>
  <div class="memo-list-container">
    <div class="list-header">
      <h2>メモ一覧</h2>
      <span class="badge">{{ memoStore.memos.length }} 件</span>
    </div>

    <div class="memo-grid">
      <div v-for="memo in memoStore.memos" :key="memo.id" class="memo-card">
        <div class="memo-header">
          <time class="memo-date">{{ formatDate(memo.createdAt) }}</time>
          <div class="memo-actions">
            <button
              class="btn-edit"
              @click="startEditingMemo(memo)"
              title="編集"
            >
              ✏️
            </button>
            <button
              class="btn-delete"
              @click="handleDelete(memo.id)"
              title="削除"
            >
              🗑️
            </button>
          </div>
        </div>

        <div v-if="editingMemoId === memo.id" class="memo-edit-form">
          <textarea
            v-model="editingText"
            class="edit-textarea"
            maxlength="1000"
          ></textarea>
          <div class="edit-actions">
            <button class="btn-save" @click="handleSave(memo.id)">
              💾 保存
            </button>
            <button class="btn-cancel" @click="cancelEdit">
              キャンセル
            </button>
          </div>
        </div>

        <div v-else class="memo-content">
          <p>{{ memo.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemoStore } from '@/stores/memos'
import type { MemoResponse } from '@/api/client'

const memoStore = useMemoStore()
const editingMemoId = ref<string | null>(null)
const editingText = ref('')

const emit = defineEmits<{
  deleted: []
}>()

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const startEditingMemo = (memo: MemoResponse) => {
  editingMemoId.value = memo.id
  editingText.value = memo.text
}

const cancelEdit = () => {
  editingMemoId.value = null
  editingText.value = ''
}

const handleSave = async (memoId: string) => {
  if (!editingText.value.trim()) {
    alert('メモの内容を入力してください')
    return
  }

  try {
    await memoStore.updateMemo(memoId, editingText.value)
    editingMemoId.value = null
    editingText.value = ''
  } catch (error) {
    alert('メモの更新に失敗しました')
  }
}

const handleDelete = async (memoId: string) => {
  if (!confirm('このメモを削除してもよろしいですか？')) {
    return
  }

  try {
    await memoStore.deleteMemo(memoId)
    emit('deleted')
  } catch (error) {
    alert('メモの削除に失敗しました')
  }
}
</script>

<style scoped>
.memo-list-container {
  margin-top: 30px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  color: #333;
  font-size: 1.3em;
}

.badge {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
}

.memo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.memo-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.memo-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.memo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

.memo-date {
  font-size: 0.85em;
  color: #999;
}

.memo-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 4px 8px;
  transition: transform 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  transform: scale(1.2);
}

.memo-content {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  max-height: 150px;
}

.memo-content p {
  color: #333;
  line-height: 1.5;
  word-break: break-all;
  white-space: pre-wrap;
  margin: 0;
}

.memo-edit-form {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95em;
  resize: vertical;
  min-height: 100px;
  max-height: 200px;
}

.edit-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background: #667eea;
  color: white;
}

.btn-save:hover {
  background: #5568d3;
}

.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

@media (max-width: 768px) {
  .memo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
