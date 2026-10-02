<script setup lang="ts">
import { ref } from 'vue'
import { useAdminSession } from '~/stores/adminSession'
import { createVolunteer, ApiError } from '~/lib/api/admin'

definePageMeta({ layout: 'admin' })

const session = useAdminSession()

const name = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const credentials = ref<{ name: string; pin: string; password: string } | null>(null)

async function submit() {
  if (!name.value.trim() || submitting.value) return
  submitting.value = true
  error.value = null
  try {
    const result = await createVolunteer(name.value.trim())
    credentials.value = {
      name: result.volunteer.name,
      pin: result.pin,
      password: result.password,
    }
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to create volunteer'
  } finally {
    submitting.value = false
  }
}

function onDone() {
  navigateTo('/admin/volunteers')
}

if (!session.isAuthenticated) {
  navigateTo('/admin')
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-semibold mb-6">New volunteer</h1>

    <CredentialsCard
      v-if="credentials"
      :volunteer-name="credentials.name"
      :pin="credentials.pin"
      :password="credentials.password"
      @done="onDone"
    />

    <Card v-else>
      <template #content>
        <div class="flex flex-col gap-4">
          <div>
            <label for="volunteer-name" class="text-sm font-medium text-slate-600 block mb-1">
              Name
            </label>
            <InputText
              id="volunteer-name"
              v-model="name"
              data-testid="volunteer-name-input"
              placeholder="Grace Hopper"
              class="w-full"
              :disabled="submitting"
              @keyup.enter="submit"
            />
          </div>

          <Message v-if="error" severity="error" :closable="false">
            {{ error }}
          </Message>

          <div class="flex gap-2">
            <Button
              data-testid="create-volunteer"
              label="Create"
              :loading="submitting"
              :disabled="!name.trim()"
              @click="submit"
            />
            <Button
              label="Cancel"
              severity="secondary"
              as="router-link"
              to="/admin/volunteers"
              :disabled="submitting"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
