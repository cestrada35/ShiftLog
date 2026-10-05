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
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <header class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <h1 class="text-lg font-semibold">ShiftLog Admin</h1>
      <div class="flex items-center gap-4 text-sm">
        <span v-if="session.admin" class="text-slate-600">
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

    <div class="flex flex-1 min-h-0">
      <AdminNav v-if="session.isAuthenticated" />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>