<script setup lang="ts">
import { watch } from 'vue'
import { useAdminSession } from '~/stores/adminSession'

const session = useAdminSession()
const router = useRouter()
const route = useRoute()

watch(
  () => session.isAuthenticated,
  (isAuth) => {
    if (!isAuth && route.path !== '/admin/sign-in') {
      router.push('/admin/sign-in')
    }
  },
)
</script>

<template>
  <div class="surface surface-dotted surface-dotted--quiet admin-layout">
    <header class="admin-header surface-chrome">
      <div class="admin-brand">
        <span class="brand-mark">
          Shift<span class="brand-mark__accent">Log</span><span class="brand-mark__dot">.</span>
        </span>
        <span class="brand-tagline">Admin</span>
      </div>
      <div class="admin-session">
        <span v-if="session.admin" class="admin-session__name">
          {{ session.admin.name }}
        </span>
        <Button
          v-if="session.isAuthenticated"
          label="Sign out"
          severity="secondary"
          size="small"
          @click="session.signOut"
        />
      </div>
    </header>

    <div class="admin-body">
      <AdminNav v-if="session.isAuthenticated" />
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
  .admin-layout {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    flex-shrink: 0;
  }

  .admin-brand {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .admin-session {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
  }

  .admin-session__name {
    color: var(--p-text-muted-color);
  }

  .admin-body {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .admin-main {
    flex: 1;
    padding: 1.5rem;
    overflow: auto;
  }
</style>