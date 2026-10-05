<script setup lang="ts">
import type { RecentShift } from '~/lib/api'

defineProps<{
  shifts: RecentShift[]
}>()

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function duration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return '—'
  const minutes = Math.floor(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60_000,
  )
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <span>Recent activity</span>
      </div>
    </template>
    <template #content>
      <p v-if="shifts.length === 0" data-testid="recent-shifts-empty" class="text-slate-500 py-4">
        No shifts recorded yet.
      </p>
      <table v-else class="w-full text-left text-sm" data-testid="recent-shifts-table">
        <thead>
          <tr class="border-b border-slate-200">
            <th class="py-2 font-medium text-slate-600">Volunteer</th>
            <th class="py-2 font-medium text-slate-600">Project</th>
            <th class="py-2 font-medium text-slate-600">Started</th>
            <th class="py-2 font-medium text-slate-600 text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="shift in shifts"
            :key="shift.id"
            class="border-b border-slate-100 last:border-b-0"
          >
            <td class="py-2">{{ shift.volunteerName }}</td>
            <td class="py-2 text-slate-600">{{ shift.projectName }}</td>
            <td class="py-2 text-slate-600">{{ formatDateTime(shift.startedAt) }}</td>
            <td class="py-2 text-right text-slate-600">
              {{ duration(shift.startedAt, shift.endedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </Card>
</template>