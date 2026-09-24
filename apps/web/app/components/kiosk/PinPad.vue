<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', pin: string): void
}>()

const pin = ref('')

function handleSubmit() {
  if (pin.value.length === 0) return
  emit('submit', pin.value)
  pin.value = ''
}
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <template #content>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
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
        />
        <Button
          type="submit"
          data-testid="pin-submit"
          label="Continue"
          class="w-full"
        />
      </form>
    </template>
  </Card>
</template>