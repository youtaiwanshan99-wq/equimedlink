// Usage: node scripts/write-env-from-json.mjs C:/path/to/serviceAccount.json
import fs from 'fs'
import path from 'path'

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('Provide service account json path')
  process.exit(1)
}

const raw = fs.readFileSync(jsonPath, 'utf8')
const j = JSON.parse(raw)

const projectId = j.project_id
const clientEmail = j.client_email
// Make single line with literal \n for dotenv compatibility
const privateKeyEscaped = String(j.private_key).replace(/\r?\n/g, '\\n')

const out = [
  `FIREBASE_PROJECT_ID=${projectId}`,
  `FIREBASE_CLIENT_EMAIL=${clientEmail}`,
  `FIREBASE_PRIVATE_KEY=${privateKeyEscaped}`,
].join('\n')

fs.writeFileSync(path.join(process.cwd(), '.env.local'), out)
console.log('Wrote .env.local for project:', projectId)




