export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">EquiMed Spot MVP</h1>
      <p className="mt-2 text-sm text-gray-600">ヒートマップとマッチングのデモ</p>
      <div className="mt-4">
        <a className="underline text-blue-600" href="/map">/map を開く</a>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        まずは <code>scripts/seed.mjs</code> でダミーデータを投入してからご覧ください。
      </div>
    </main>
  )
}
