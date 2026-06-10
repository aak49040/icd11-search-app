import type { NextConfig } from "next";

// 全ルートに付与するセキュリティヘッダ。
// 表示を壊さない範囲のみ。Content-Security-Policy は Next.js のハイドレーション用
// インラインスクリプトを壊す恐れがあるため、ここでは未導入（導入時は nonce 方式で要検証）。
const securityHeaders = [
  // クリックジャッキング対策（iframe 埋め込み禁止）。
  // どこかに iframe で貼る予定があれば "SAMEORIGIN" に変更する。
  { key: "X-Frame-Options", value: "DENY" },
  // MIME スニフィング無効化。
  { key: "X-Content-Type-Options", value: "nosniff" },
  // リファラ送出を最小化。
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 未使用デバイス機能の無効化。
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
