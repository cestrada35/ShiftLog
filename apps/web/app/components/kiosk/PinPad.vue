<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const show = () => {
  toast.add({
    severity: 'success',
    summary: 'Successfully loaded toast!',
    detail: 'This is a toast message.',
    life: 3000
  })
}

// --- DEV PREVIEW ONLY — delete when PIN feedback TDD session lands ---
const shaking = ref(false)
function previewShake() {
  shaking.value = false
  requestAnimationFrame(() => { shaking.value = true })
}
onMounted(previewShake)
// ---------------------------------------------------------------------

const emit = defineEmits<{
  (e: 'submit', pin: string): void
}>()

const pin = ref('')

function handleSubmit() {
  console.log('[PinPad] handleSubmit called, pin =', JSON.stringify(pin.value))
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
        <!-- <Button variant="outlined" @click="show()">Create toast</Button> -->
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
          @keyup.enter="handleSubmit"
        />
        <Button
          data-testid="pin-submit"
          label="Continue"
          class="w-full"
          @click="handleSubmit"
        />
        <Button variant="outlined" @click="previewShake">*Test Error Shake Effect*</Button>
      </div>
    </template>
  </Card>
</template>