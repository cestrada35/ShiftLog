<script setup lang="ts">
import { useAdminSession } from '~/stores/adminSession'

const session = useAdminSession()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-semibold">ShiftLog Admin</h1>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <span v-if="session.admin" class="text-slate-600">
          {{ session.admin.name }} ({{ session.admin.email }})
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
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>
