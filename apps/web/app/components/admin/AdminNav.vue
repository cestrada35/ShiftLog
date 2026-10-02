<script setup lang="ts">
const links = [
  { to: '/admin', label: 'Dashboard', icon: 'pi pi-home' },
  { to: '/admin/volunteers', label: 'Volunteers', icon: 'pi pi-users' },
  { to: '/admin/projects', label: 'Projects', icon: 'pi pi-briefcase', disabled: true },
  { to: '/admin/reports', label: 'Reports', icon: 'pi pi-chart-bar', disabled: true },
]
</script>

<template>
  <nav class="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0" data-testid="admin-nav">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.disabled ? '#' : link.to"
      :class="[
        'flex items-center gap-3 px-4 py-3 text-sm border-l-2 transition-colors',
        link.disabled
          ? 'text-slate-300 cursor-not-allowed border-transparent'
          : 'text-slate-700 hover:bg-slate-50 border-transparent',
      ]"
      :data-testid="`admin-nav-${link.label.toLowerCase()}`"
    >
      <i :class="link.icon" />
      <span>{{ link.label }}</span>
      <span v-if="link.disabled" class="ml-auto text-xs text-slate-300">soon</span>
    </NuxtLink>
  </nav>
</template>