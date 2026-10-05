<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  icon: string
  variant?: 'default' | 'success' | 'info' | 'warning'
}>()

const variantClasses: Record<string, string> = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-amber-100 text-amber-700',
}
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-start justify-between" :data-testid="`stat-${label.toLowerCase().replace(/\s+/g, '-')}`">
        <div>
          <p class="text-sm text-slate-500">{{ label }}</p>
          <p class="text-3xl font-semibold mt-1">{{ value }}</p>
        </div>
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          :class="variantClasses[variant ?? 'default']"
        >
          <i :class="icon" />
        </div>
      </div>
    </template>
  </Card>
</template>