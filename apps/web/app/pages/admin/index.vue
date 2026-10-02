<script setup lang="ts">
import { ref } from 'vue'
import { useAdminSession } from '~/stores/adminSession'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()
const inputId = ref('')

async function handleSignIn() {
  const ok = await session.signIn(inputId.value.trim())
  if (ok) inputId.value = ''
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <Card v-if="!session.isAuthenticated">
      <template #content>
        <h2 class="text-xl font-semibold mb-4">Sign in</h2>
        <p class="text-sm text-slate-500 mb-4">
          Demo mode: paste an admin UUID to sign in. In production this would be email + password.
        </p>
        <div class="flex flex-col gap-4">
          <InputText
            v-model="inputId"
            data-testid="admin-id-input"
            placeholder="Admin UUID"
            class="w-full"
            @keyup.enter="handleSignIn"
          />
          <p v-if="session.error" data-testid="admin-error" class="text-sm text-red-600">
            {{ session.error }}
          </p>
          <Button
            data-testid="admin-sign-in"
            label="Sign in"
            :disabled="!inputId || session.loading"
            :loading="session.loading"
            @click="handleSignIn"
          />
        </div>
      </template>
    </Card>

    <Card v-else>
      <template #content>
        <p class="text-slate-700">
          Signed in as <strong>{{ session.admin?.name }}</strong>.
        </p>
        <p class="text-sm text-slate-500 mt-2">
          Admin features land here in the next slice.
        </p>
      </template>
    </Card>
  </div>
</template>
