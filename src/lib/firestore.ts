import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const resolvePrivateKey = (): string => {
  // 1) Base64 系の候補名を試す
  const b64Candidates = [
    process.env.FIREBASE_PRIVATE_KEY_64,
    process.env.FIREBASE_PRIVATE_KEY_B64,
    process.env.FIREBASE_PRIVATE_KEY_BASE64,
    process.env.GOOGLE_PRIVATE_KEY_B64,
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY_B64,
  ].filter(Boolean) as string[]
  for (const c of b64Candidates) {
    try {
      const s = Buffer.from(c, 'base64').toString('utf8')
      if (s.includes('BEGIN PRIVATE KEY')) return s
    } catch {}
  }

  // 2) 生文字列（\n 置換）系の候補名
  const rawCandidates = [
    process.env.FIREBASE_PRIVATE_KEY,
    process.env.GOOGLE_PRIVATE_KEY,
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  ].filter(Boolean) as string[]
  for (const r of rawCandidates) {
    if (r.includes('\\n')) return r.replace(/\\n/g, '\n')
    if (r.includes('BEGIN PRIVATE KEY')) return r
  }

  return ''
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: resolvePrivateKey(),
      }),
    })

export const db = getFirestore(app)


