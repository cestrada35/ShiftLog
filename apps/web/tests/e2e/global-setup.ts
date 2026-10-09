import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_DIR = path.resolve(__dirname, '../../../api')

export default function globalSetup() {
  if (process.env.SKIP_DB_RESET === 'true') {
    console.log('[globalSetup] Skipping DB reset (SKIP_DB_RESET=true)')
    return
  }

  console.log('[globalSetup] Resetting demo database locally...')
  execSync('python manage.py reset_demo', { cwd: API_DIR, stdio: 'inherit' })
}