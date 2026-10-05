<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <header class="bg-white border-b border-slate-200 py-6 px-8">
      <h1 class="text-2xl font-bold text-slate-900 text-center">ShiftLog</h1>
      <p class="text-center text-sm text-slate-500 mt-1">Volunteer check-in</p>
    </header>
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-lg">
        <slot />
      </div>
    </main>
  </div>
</template>