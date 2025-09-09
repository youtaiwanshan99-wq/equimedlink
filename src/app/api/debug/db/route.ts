import { NextResponse } from 'next/server'

export async function GET() {
  const env = {
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_B64: !!process.env.FIREBASE_PRIVATE_KEY_B64,
  }

  const hasKey = env.FIREBASE_PRIVATE_KEY || env.FIREBASE_PRIVATE_KEY_B64
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !hasKey) {
    return NextResponse.json({ connected: false, reason: 'env_missing', env }, { status: 200 })
  }

  try {
    // 動的インポートでFirebaseを読み込み
    const { db } = await import('@/lib/firestore')
    const hospitalsSnap = await db.collection('hospitals').get()
    const shiftsSnap = await db.collection('shifts').get()
    return NextResponse.json({
      connected: true,
      projectId: process.env.FIREBASE_PROJECT_ID,
      counts: { hospitals: hospitalsSnap.size, shifts: shiftsSnap.size },
      env
    })
  } catch (e: any) {
    return NextResponse.json({ connected: false, reason: 'query_failed', error: String(e), env }, { status: 200 })
  }
}


