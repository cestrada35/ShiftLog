import { useAdminSession } from '~/stores/adminSession'

export default defineNuxtPlugin(async () => {
  const session = useAdminSession()
  await session.loadFromStorage()
})
