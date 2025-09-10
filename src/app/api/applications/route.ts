import { NextResponse } from 'next/server'

// 応募作成（POST）
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const now = Date.now()
    const application = {
      id: `app_${now}`,
      created_at: now,
      updated_at: now,
      ...body,
    }

    // ENVが揃っている場合のみFirestoreに保存
    const hasEnv = !!process.env.FIREBASE_PROJECT_ID && !!process.env.FIREBASE_CLIENT_EMAIL && (!!process.env.FIREBASE_PRIVATE_KEY || !!process.env.FIREBASE_PRIVATE_KEY_B64)
    if (hasEnv) {
      const { db } = await import('@/lib/firestore')
      await db.collection('applications').doc(application.id).set(application, { merge: true })
    }

    return NextResponse.json({ ok: true, applicationId: application.id })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}



