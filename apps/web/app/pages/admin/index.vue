<script setup lang="ts">
import { useAdminSession } from '~/stores/adminSession'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()

if (!session.isAuthenticated) {
  await navigateTo('/admin/sign-in')
}
</script>

<template>
  <div class="max-w-5xl" data-testid="admin-dashboard">
    <h1 class="text-2xl font-semibold mb-6">
      Welcome back, {{ session.admin?.name }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Stat cards land here next -->
      <Card>
        <template #content>
          <p class="text-sm text-slate-500">Stats coming soon</p>
        </template>
      </Card>
    </div>
  </div>
</template>