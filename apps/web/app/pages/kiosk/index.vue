<script setup lang="ts">
  import { useKioskSession } from '~/composables/useKioskSession'
  import { useAutoReset } from '~/composables/useAutoReset'

  const shakeNonce = ref(0)

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
    failedAttempts
  } = useKioskSession()

  const { countdown } = useAutoReset(
    state,
    ['active', 'completed', 'error'],
    {
      durationSeconds: 10,
      onReset: reset,
    },
  )

  function formatTime(iso: string | undefined): string {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  definePageMeta({ layout: 'kiosk' })
</script>

<template>
  <!-- <div class="min-h-screen flex items-center justify-center bg-slate-100"> -->
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">ShiftLog Kiosk</h1>

      <PinPad 
        :shake-nonce="failedAttempts" 
        v-if="state === 'idle' || state === 'error'" 
        :error-message="state === 'error' ? error : null"
        @submit="identify" />

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

      <!-- <Card v-else-if="state === 'error'">
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
      </Card> -->

      <Card v-else-if="state === 'active'">
        <template #content>
          <div class="text-center">
            <p class="text-3xl font-semibold mb-2" data-testid="on-shift">You're on shift</p>
            <p class="text-lg text-slate-500">
              {{ volunteer?.name }} · started {{ formatTime(activeShift?.startedAt) }}
            </p>
            <Button
              data-testid="check-out"
              label="Check out"
              size="large"
              class="w-full mt-8"
              :disabled="state === 'submitting'"
              :loading="state === 'submitting'"
              @click="submitCheckOut"
            />
            <p class="text-xs text-slate-400 mt-4" data-testid="auto-reset-countdown">
              Returning to start in {{ countdown }}s
            </p>
          </div>
        </template>
      </Card>

      <Card v-else-if="state === 'completed'">
        <template #content>
          <div data-testid="completed" class="text-center">
            <p class="text-3xl font-semibold mb-2">Thanks, {{ volunteer?.name }}</p>
            <p class="text-lg text-slate-500">Shift recorded.</p>
            <p class="text-xs text-slate-400 mt-6" data-testid="auto-reset-countdown">
              Returning to start in {{ countdown }}s
            </p>
          </div>
        </template>
      </Card>
    </div>
  <!-- </div> -->
</template>