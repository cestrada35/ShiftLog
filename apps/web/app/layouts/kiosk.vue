<template>
  <div class="surface surface-dotted kiosk-layout">
    <header class="kiosk-header surface-chrome">
      <div class="kiosk-brand">
        <span class="brand-mark">
          Shift<span class="brand-mark__accent">Log</span><span class="brand-mark__dot">.</span>
        </span>
        <span class="brand-tagline">Kiosk</span>
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
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
  }

  .kiosk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem;
  }

  .kiosk-brand {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .kiosk-main {
    display: grid;
    place-items: center;
    padding: 2rem;
  }

  .kiosk-stage {
    width: 100%;
    max-width: 32rem;
  }

  .kiosk-footer {
    padding: 1.75rem 2rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted-color);
  }
</style>