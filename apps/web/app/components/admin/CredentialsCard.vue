<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  volunteerName: string
  pin: string
  password: string
}>()

const emit = defineEmits<{
  (e: 'done'): void
}>()

const copied = ref<'pin' | 'password' | null>(null)

async function copy(field: 'pin' | 'password', value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copied.value = field
    setTimeout(() => {
      if (copied.value === field) copied.value = null
    }, 2000)
  } catch {
    // Clipboard unavailable (older browsers, insecure context). Silent fail.
  }
}
</script>

<template>
  <Card>
    <template #content>
      <div data-testid="credentials-card">
        <h2 class="text-xl font-semibold mb-2">Credentials for {{ volunteerName }}</h2>
        <p class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-6">
          Copy these now. You won't be able to see them again.
        </p>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600 block mb-1">PIN (kiosk)</label>
            <div class="flex gap-2">
              <code
                data-testid="credentials-pin"
                class="flex-1 font-mono text-lg bg-slate-100 rounded px-3 py-2"
              >{{ pin }}</code>
              <Button
                data-testid="copy-pin"
                :label="copied === 'pin' ? 'Copied' : 'Copy'"
                size="small"
                severity="secondary"
                @click="copy('pin', pin)"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-slate-600 block mb-1">Password (remote)</label>
            <div class="flex gap-2">
              <code
                data-testid="credentials-password"
                class="flex-1 font-mono text-lg bg-slate-100 rounded px-3 py-2 break-all"
              >{{ password }}</code>
              <Button
                data-testid="copy-password"
                :label="copied === 'password' ? 'Copied' : 'Copy'"
                size="small"
                severity="secondary"
                @click="copy('password', password)"
              />
            </div>
          </div>
        </div>

        <Button
          data-testid="credentials-done"
          label="Done"
          class="w-full mt-6"
          @click="emit('done')"
        />
      </div>
    </template>
  </Card>
</template>
