<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminSession } from '~/stores/adminSession'
import { getDashboardStats, ApiError } from '~/lib/api/admin'
import type { DashboardStats } from '~/lib/api'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()
const stats = ref<DashboardStats | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

if (!session.isAuthenticated) {
  await navigateTo('/admin/sign-in')
}

async function load() {
  loading.value = true
  error.value = null
  try {
    stats.value = await getDashboardStats()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="max-w-6xl" data-testid="admin-dashboard">
    <h1 class="text-2xl font-semibold mb-6">
      Welcome back, {{ session.admin?.name }}
    </h1>

    <Message v-if="error" severity="error" :closable="false" class="mb-4">
      {{ error }}
    </Message>

    <div v-if="loading && !stats" class="text-slate-500" data-testid="dashboard-loading">
      Loading…
    </div>

    <template v-else-if="stats">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Volunteers"
          :value="stats.totalVolunteers"
          icon="pi pi-users"
          variant="info"
        />
        <StatCard
          label="Active Volunteers"
          :value="stats.activeVolunteers"
          icon="pi pi-user-plus"
          variant="success"
        />
        <StatCard
          label="Projects"
          :value="stats.totalProjects"
          icon="pi pi-briefcase"
        />
        <StatCard
          label="Shifts Today"
          :value="stats.shiftsToday"
          icon="pi pi-clock"
          variant="warning"
        />
      </div>

      <RecentShifts :shifts="stats.recentShifts" />
    </template>
  </div>
</template>