<script setup lang="ts">
import type { Project } from '~/lib/api'

const props = defineProps<{
  projects: Project[]
  selectedId: string | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', projectId: string): void
}>()

function select(projectId: string) {
  if (props.disabled) return
  emit('select', projectId)
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (props.disabled) return
  const len = props.projects.length
  let next = index

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % len
  else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + len) % len
  else return

  event.preventDefault()
  select(props.projects[next].id)
  const buttons = (event.currentTarget as HTMLElement)
    .parentElement
    ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
  buttons?.[next]?.focus()
}
</script>

<template>
  <div
    data-testid="project-picker"
    role="radiogroup"
    aria-label="Select a project"
    class="flex flex-col gap-3"
  >
    <button
      v-for="(project, index) in projects"
      :key="project.id"
      type="button"
      role="radio"
      :aria-checked="selectedId === project.id"
      :data-testid="`project-${project.id}`"
      :disabled="disabled"
      :tabindex="selectedId === project.id || (selectedId === null && index === 0) ? 0 : -1"
      class="text-left p-4 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="selectedId === project.id
        ? 'border-blue-500 bg-blue-50'
        : 'border-slate-200 bg-white hover:border-slate-400'"
      @click="select(project.id)"
      @keydown="onKeydown($event, index)"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1">
          <p class="font-semibold text-slate-900">{{ project.name }}</p>
          <p v-if="project.description" class="text-sm text-slate-600 mt-1">
            {{ project.description }}
          </p>
        </div>
        <span
          v-if="selectedId === project.id"
          class="text-blue-600 text-xl leading-none"
          aria-hidden="true"
        >✓</span>
      </div>
    </button>
  </div>
</template>