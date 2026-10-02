export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const useMocks = config.public.useMocks

  if (import.meta.dev && import.meta.client && useMocks) {
    const { worker } = await import('~/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass', quiet: false })
    console.log('[MSW] Mock Service Worker started; API calls will be intercepted')
  }
})
