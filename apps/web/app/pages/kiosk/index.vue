<script setup lang="ts">
import { useKioskSession } from '~/composables/useKioskSession'

const {
  state,
  volunteer,
  projects,
  selectedProjectId,
  error,
  identify,
  selectProject,
  submitCheckIn,
  reset,
} = useKioskSession()
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
          <p class="text-xl text-center">On shift</p>
          <p class="text-sm text-slate-500 text-center mt-1">
            (Check-out UI coming next)
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>