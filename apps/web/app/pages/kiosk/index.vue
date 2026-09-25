<script setup lang="ts">
import { useKioskSession } from '~/composables/useKioskSession'

const { state, volunteer, error, identify, reset } = useKioskSession()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">ShiftLog Kiosk</h1>

      <PinPad v-if="state === 'idle'" @submit="identify" />

      <Card v-else-if="state === 'identified'">
        <template #content>
          <p class="text-xl text-center" data-testid="welcome">
            Welcome, {{ volunteer?.name }}
          </p>
          <Button
            data-testid="reset"
            label="Done"
            class="w-full mt-6"
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
            data-testid="retry"
            label="Try again"
            class="w-full mt-6"
            @click="reset"
          />
        </template>
      </Card>
      <div v-else>
        <p>test2</p>
      </div>
    </div>
  </div>
</template>