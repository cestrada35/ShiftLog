<script setup lang="ts">
import type { Volunteer } from '~/lib/api'

const props = defineProps<{
  volunteers: Volunteer[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-active', volunteerId: string, isActive: boolean): void
}>()

function toggle(volunteer: Volunteer) {
  emit('toggle-active', volunteer.id, !volunteer.isActive)
}
</script>

<template>
  <div data-testid="volunteer-table">
    <p v-if="loading" data-testid="volunteer-loading" class="text-slate-500 py-4">
      Loading…
    </p>

    <p v-else-if="volunteers.length === 0" data-testid="volunteer-empty" class="text-slate-500 py-4">
      No volunteers yet.
    </p>

    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-200">
          <th class="py-2 px-3 font-medium text-slate-600">Name</th>
          <th class="py-2 px-3 font-medium text-slate-600">Status</th>
          <th class="py-2 px-3 font-medium text-slate-600 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          :data-testid="`volunteer-row-${volunteer.id}`"
          class="border-b border-slate-100"
        >
          <td class="py-3 px-3">{{ volunteer.name }}</td>
          <td class="py-3 px-3">
            <span
              :data-testid="`volunteer-status-${volunteer.id}`"
              :class="volunteer.isActive ? 'text-green-700' : 'text-slate-400'"
            >
              {{ volunteer.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="py-3 px-3 text-right">
            <Button
              :data-testid="`volunteer-toggle-${volunteer.id}`"
              :label="volunteer.isActive ? 'Deactivate' : 'Activate'"
              :severity="volunteer.isActive ? 'danger' : 'success'"
              size="small"
              text
              @click="toggle(volunteer)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>s