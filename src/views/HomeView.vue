<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <div>
          <h1>📝 Memo System</h1>
          <p>シンプルで効率的なメモ管理アプリケーション</p>
        </div>
        <button class="logout-btn" @click="handleLogout">ログアウト</button>
      </div>
    </header>

    <main class="app-main">
      <!-- メモ作成フォーム -->
      <MemoForm @created="onMemoCreated" />

      <!-- エラーメッセージ -->
      <div v-if="memoStore.error" class="error-message">
        <button class="close-btn" @click="memoStore.clearError">✕</button>
        {{ memoStore.error }}
      </div>

      <!-- 検索フィルター -->
      <div class="search-section">
        <input
          v-model="searchInput"
          type="text"
          placeholder="メモを検索..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">🔍 検索</button>
        <button v-if="memoStore.keyword" class="clear-btn" @click="handleClearSearch">
          クリア
        </button>
      </div>

      <!-- 検索結果情報 -->
      <div class="info-section">
        <p v-if="memoStore.keyword" class="search-info">
          検索キーワード: <strong>{{ memoStore.keyword }}</strong>
        </p>
        <p class="memo-count">
          全メモ数: <strong>{{ memoStore.total }}</strong>
        </p>
      </div>

      <!-- メモ一覧 -->
      <div v-if="memoStore.loading" class="loading">
        <p>読み込み中...</p>
      </div>

      <div v-else-if="memoStore.isEmpty" class="empty-state">
        <p>📭 メモがまだありません</p>
        <p>最初のメモを作成してみましょう！</p>
      </div>

      <MemoList v-else @deleted="onMemoDeleted" />

      <!-- ページネーション -->
      <div v-if="memoStore.totalPages > 1" class="pagination">
        <button
          v-for="p in memoStore.totalPages"
          :key="p"
          :class="['page-btn', { active: memoStore.page === p }]"
          @click="handlePageChange(p)"
        >
          {{ p }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memos'
import { useAuthStore } from '@/stores/auth'
import MemoForm from '@/components/MemoForm.vue'
import MemoList from '@/components/MemoList.vue'

const router = useRouter()
const memoStore = useMemoStore()
const authStore = useAuthStore()
const searchInput = ref('')

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  memoStore.fetchMemos()
})

const onMemoCreated = async () => {
  searchInput.value = ''
  memoStore.setKeyword('')
  await memoStore.fetchMemos()
}

const onMemoDeleted = () => {
  memoStore.fetchMemos()
}

const handleSearch = async () => {
  memoStore.setKeyword(searchInput.value)
  await memoStore.fetchMemos()
}

const handleClearSearch = async () => {
  searchInput.value = ''
  memoStore.setKeyword('')
  await memoStore.fetchMemos()
}

const handlePageChange = async (newPage: number) => {
  memoStore.setPage(newPage)
  await memoStore.fetchMemos()
}
</script>

<style scoped>
.app-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.app-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.app-header p {
  font-size: 1.1em;
  opacity: 0.9;
}

.app-main {
  padding: 30px;
}

.error-message {
  background: #fee;
  border-left: 4px solid #f44747;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c41e3a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #c41e3a;
}

.search-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn,
.clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn {
  background: #667eea;
  color: white;
}

.search-btn:hover {
  background: #5568d3;
}

.clear-btn {
  background: #e0e0e0;
  color: #333;
}

.clear-btn:hover {
  background: #d0d0d0;
}

.info-section {
  margin: 15px 0;
  font-size: 0.95em;
}

.search-info {
  color: #667eea;
  margin-bottom: 5px;
}

.memo-count {
  color: #666;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1.1em;
}

.empty-state {
  text-align: center;
  padding: 60px 30px;
  color: #999;
}

.empty-state p:first-child {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>
