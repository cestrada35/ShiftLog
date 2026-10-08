<!-- apps/web/app/layouts/kiosk.vue -->
<script setup lang="ts">

</script>

<template>
  <div class="kiosk-layout">
    <header class="kiosk-header">
      <div class="kiosk-brand">
        <span class="kiosk-brand__mark">ShiftLog</span>
        <span class="kiosk-brand__tagline">Volunteer check-in</span>
      </div>
    </header>

    <main class="kiosk-main">
      <div class="kiosk-stage">
        <slot />
      </div>
    </main>

    <footer class="kiosk-footer">
      Need help? Ask site coordinator for assistance.
    </footer>
  </div>
</template>

<style scoped>
  .kiosk-layout {
    --p-primary-color: var(--p-primary-600);
    --p-content-background: var(--p-surface-0);
    --p-text-color: var(--p-surface-900);
    --p-text-muted-color: var(--p-surface-600);

    --dot-color: color-mix(in srgb, var(--p-primary-500) 30%, transparent);
    /* --dot-color: rgba(226, 93, 4, 0.4); */
    --dot-size: 2px;
    --dot-spacing: 24px;

    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;

    background-color: var(--p-surface-100);
    background-image:
      radial-gradient(circle at 110% -10%,
        color-mix(in srgb, var(--p-primary-400) 50%, transparent) 0 340px,
        color-mix(in srgb, var(--p-primary-200) 40%, transparent) 340px 520px,
        transparent 520px),
      radial-gradient(circle,
        var(--dot-color) var(--dot-size),
        transparent var(--dot-size));
    background-size: 100% 100%, var(--dot-spacing) var(--dot-spacing);
  }

  .kiosk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem;
    background: color-mix(in srgb, var(--p-primary-100) 50%, transparent);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid color-mix(in srgb, var(--p-primary-600) 20%, transparent);
  }

  .kiosk-brand {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .kiosk-brand__mark {
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--p-text-color);
  }

  .kiosk-brand__tagline {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .kiosk-main {
    display: grid;
    place-items: center;
    padding: 2rem;
  }

  .kiosk-stage {
    width: 100%;
    max-width: 32rem;   /* was max-w-lg on the card; now it lives here */
  }

  .kiosk-footer {
    padding: 1.75rem 2rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted-color);
  }
</style>