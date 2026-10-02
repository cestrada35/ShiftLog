import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_DIR = path.resolve(__dirname, '../../../api')

export default function globalSetup() {
  console.log('Resetting and reseeding the Django DB...')
  execSync('python manage.py reset_demo', {
    cwd: API_DIR,
    stdio: 'inherit',
  })
  console.log('Django DB reset and reseeded.')
}
