<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = withDefaults(defineProps<{
  shakeNonce: number
}>(), {
  shakeNonce: 0,
})

const shaking = ref(false)

watch(() => props.shakeNonce, () => {
  shaking.value = false
  requestAnimationFrame(() => { shaking.value = true })
})

const show = () => {
  toast.add({
    severity: 'success',
    summary: 'Successfully loaded toast!',
    detail: 'This is a toast message.',
    life: 3000
  })
}

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
  <Card
    :class="['w-full max-w-md mx-auto', { 'kiosk-shake': shaking }]"
    @animationend="shaking = false"
  >
    <template #content>
      <div class="">
        <!-- <Button variant="outlined" @click="show()">Create toast</Button> -->
        <label for="pin" class="">Enter your PIN</label>
        <InputText
          id="pin"
          v-model="pin"
          data-testid="pin-input"
          type="password"
          inputmode="numeric"
          autocomplete="off"
          :maxlength="6"
          class="text-2xl text-center tracking-widest"
          fluid
          @keyup.enter="handleSubmit"
        />
        <Button data-testid="pin-submit" label="Continue" fluid raised @click="handleSubmit" />
        <!-- <Button variant="outlined" @click="previewShake">*Test Error Shake Effect*</Button> -->
      </div>
    </template>
  </Card>
</template>