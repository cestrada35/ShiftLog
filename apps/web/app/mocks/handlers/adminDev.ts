import { http, HttpResponse, delay } from 'msw'
import { admins } from '../fixtures/data'

export const adminDevHandlers = [
  http.get('/api/admin/dev/admins', async () => {
    await delay(80)
    return HttpResponse.json(Object.values(admins))
  }),
]