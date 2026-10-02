<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminSession } from '~/stores/adminSession'
import { listVolunteers, updateVolunteer, ApiError } from '~/lib/api/admin'
import type { Volunteer } from '~/lib/api'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()
const volunteers = ref<Volunteer[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    volunteers.value = await listVolunteers()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to load volunteers'
  } finally {
    loading.value = false
  }
}

async function onToggleActive(id: string, isActive: boolean) {
  error.value = null
  try {
    const updated = await updateVolunteer(id, { isActive })
    const index = volunteers.value.findIndex(v => v.id === id)
    if (index >= 0) volunteers.value[index] = updated
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to update volunteer'
  }
}

onMounted(async () => {
  if (!session.isAuthenticated) {
    await navigateTo('/admin')
    return
  }
  await load()
})
</script>

<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Volunteers</h1>
      <Button
        data-testid="new-volunteer"
        label="New volunteer"
        icon="pi pi-plus"
        as="router-link"
        to="/admin/volunteers/new"
      />
    </div>

    <Message v-if="error" severity="error" :closable="false" class="mb-4">
      {{ error }}
    </Message>

    <Card>
      <template #content>
        <VolunteerTable
          :volunteers="volunteers"
          :loading="loading"
          @toggle-active="onToggleActive"
        />
      </template>
    </Card>
  </div>
</template>
