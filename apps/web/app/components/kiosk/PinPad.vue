<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  shakeNonce?: number
  errorMessage?: string | null
}>(), {
  shakeNonce: 0,
  errorMessage: null,
})

const emit = defineEmits<{
  (e: 'submit', pin: string): void
}>()

const shaking = ref(false)

watch(() => props.shakeNonce, () => {
  shaking.value = false
  requestAnimationFrame(() => { shaking.value = true })
})

const pin = ref('')

function handleSubmit() {
  if (pin.value.length === 0) return
  emit('submit', pin.value)
  pin.value = ''
}
</script>

<template>
  <Card
    :class="['w-full max-w-md mx-auto', { 'kiosk-shake': shaking }]"
    @animationend="shaking = false"
  >
    <template #content>
      <div class="flex flex-col gap-4">
        <label for="pin" class="text-lg font-semibold">Enter your PIN</label>
        <InputText
          id="pin"
          v-model="pin"
          data-testid="pin-input"
          type="password"
          inputmode="numeric"
          autocomplete="off"
          :maxlength="6"
          class="text-2xl text-center tracking-widest"
          :invalid="!!errorMessage"
          @keyup.enter="handleSubmit"
        />
        <p
          v-if="errorMessage"
          data-testid="pin-error"
          class="text-sm text-red-600 text-center"
        >
          {{ errorMessage }}
        </p>
        <Button
          data-testid="pin-submit"
          label="Continue"
          class="w-full"
          raised
          @click="handleSubmit"
        />
      </div>
    </template>
  </Card>
</template>