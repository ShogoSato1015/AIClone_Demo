import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ページが見つかりません - Yoriai',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-9xl">🤖</div>
        <h1 className="text-4xl font-bold gradient-text">
          ページが見つかりません
        </h1>
        <p className="text-gray-600 text-lg">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
          >
            ホームに戻る
          </Link>
          <div>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}