<script setup lang="ts">
import { ref } from 'vue'

console.log('Kiosk page loaded')

const enteredPin = ref<string | null>(null)

function handlePin(pin: string) {
  enteredPin.value = pin
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">ShiftLog Kiosk</h1>
      <PinPad @submit="handlePin" />
      <p v-if="enteredPin" class="mt-4 text-center text-slate-600">
        PIN received: {{ enteredPin }}
      </p>
    </div>
  </div>
</template>