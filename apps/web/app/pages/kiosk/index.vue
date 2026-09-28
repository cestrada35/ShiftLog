<script setup lang="ts">
import { useKioskSession } from '~/composables/useKioskSession'

const {
  state,
  volunteer,
  activeShift,
  completedShift,
  projects,
  selectedProjectId,
  error,
  identify,
  selectProject,
  submitCheckIn,
  submitCheckOut,
  reset,
} = useKioskSession()

function formatTime(iso: string | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">ShiftLog Kiosk</h1>

      <PinPad v-if="state === 'idle'" @submit="identify" />

      <Card v-else-if="state === 'identified'">
        <template #content>
          <p class="text-xl mb-6">Welcome, {{ volunteer?.name }}</p>
          <ProjectPicker
            :projects="projects"
            :selected-id="selectedProjectId"
            :disabled="state === 'submitting'"
            @select="selectProject"
          />
          <Button
            data-testid="check-in"
            label="Check in"
            class="w-full mt-6"
            :disabled="!selectedProjectId || state === 'submitting'"
            :loading="state === 'submitting'"
            @click="submitCheckIn"
          />
          <Button
            label="Cancel"
            severity="secondary"
            class="w-full mt-2"
            :disabled="state === 'submitting'"
            @click="reset"
          />
        </template>
      </Card>

      <Card v-else-if="state === 'error'">
        <template #content>
          <p class="text-lg text-center text-red-600" data-testid="error">
            {{ error }}
          </p>
          <Button
            label="Try again"
            class="w-full mt-6"
            @click="reset"
          />
        </template>
      </Card>

      <Card v-else-if="state === 'active'">
        <template #content>
          <p class="text-xl text-center" data-testid="on-shift">You're on shift</p>
          <p class="text-sm text-slate-500 text-center mt-1">
            Started {{ formatTime(activeShift?.startedAt) }}
          </p>
          <Button
            data-testid="check-out"
            label="Check out"
            class="w-full mt-6"
            :disabled="state === 'submitting'"
            :loading="state === 'submitting'"
            @click="submitCheckOut"
          />
        </template>
      </Card>

      <Card v-else-if="state === 'completed'">
        <template #content>
          <div data-testid="completed">
            <p class="text-xl text-center">Thanks, {{ volunteer?.name }}</p>
            <p class="text-sm text-slate-500 text-center mt-2">
              Shift recorded.
            </p>
            <Button
              label="Done"
              class="w-full mt-6"
              @click="reset"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>