export default defineNuxtPlugin(async () => {
  if (import.meta.dev && import.meta.client) {
    const { worker } = await import('~/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    })
    console.log('[MSW] Mock Service Worker started')
  }
})