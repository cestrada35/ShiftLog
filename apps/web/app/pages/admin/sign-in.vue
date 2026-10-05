<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminSession } from '~/stores/adminSession'
import { listDevAdmins } from '~/lib/api/admin'
import type { AdminListItem } from '~/lib/api'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()
const admins = ref<AdminListItem[]>([])
const selectedId = ref<string | null>(null)
const manualId = ref('')
const showManual = ref(false)

async function loadAdmins() {
  try {
    admins.value = await listDevAdmins()
    if (admins.value.length > 0 && !selectedId.value) {
      selectedId.value = admins.value[0].id
    }
  } catch {
    // Dev endpoint unavailable (probably non-DEBUG). Fall back to manual input.
    showManual.value = true
  }
}

async function signInWith(id: string) {
  const ok = await session.signIn(id)
  if (ok) await navigateTo('/admin')
}

onMounted(loadAdmins)

if (session.isAuthenticated) {
  navigateTo('/admin')
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <Card v-if="!session.isAuthenticated">
      <template #content>
        <h2 class="text-xl font-semibold mb-4">Sign in</h2>

        <div v-if="!showManual && admins.length > 0" class="flex flex-col gap-4">
          <div>
            <label class="text-sm font-medium text-slate-600 block mb-1">
              Choose an admin
            </label>
            <Select
              v-model="selectedId"
              :options="admins"
              option-label="name"
              option-value="id"
              placeholder="Select an admin"
              class="w-full"
              data-testid="admin-select"
            >
              <template #option="slotProps">
                <div class="flex flex-col">
                  <span>{{ slotProps.option.name }}</span>
                  <span class="text-xs text-slate-500">{{ slotProps.option.email }}</span>
                </div>
              </template>
            </Select>
          </div>

          <p v-if="session.error" data-testid="admin-error" class="text-sm text-red-600">
            {{ session.error }}
          </p>

          <Button
            data-testid="admin-sign-in"
            label="Sign in"
            :disabled="!selectedId || session.loading"
            :loading="session.loading"
            @click="signInWith(selectedId!)"
          />

          <button
            type="button"
            class="text-xs text-slate-500 underline"
            @click="showManual = true"
          >
            Enter UUID manually
          </button>
        </div>

        <div v-else class="flex flex-col gap-4">
          <p class="text-sm text-slate-500">
            Demo mode: paste an admin UUID to sign in.
          </p>
          <InputText
            v-model="manualId"
            data-testid="admin-id-input"
            placeholder="Admin UUID"
            class="w-full"
            @keyup.enter="signInWith(manualId.trim())"
          />
          <p v-if="session.error" data-testid="admin-error" class="text-sm text-red-600">
            {{ session.error }}
          </p>
          <Button
            data-testid="admin-sign-in"
            label="Sign in"
            :disabled="!manualId || session.loading"
            :loading="session.loading"
            @click="signInWith(manualId.trim())"
          />
          <button
            v-if="admins.length > 0"
            type="button"
            class="text-xs text-slate-500 underline"
            @click="showManual = false"
          >
            Back to admin list
          </button>
        </div>
      </template>
    </Card>
  </div>
</template>