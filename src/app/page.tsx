'use client';

import { useState } from 'react';

// APIルートで定義した型と同じものをこちらでも定義
interface ICDItem {
  ICD10_Code: string | number;
  ICD10_Name: string;
  ICD11_Code: string;
  ICD11_Name: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ICDItem[]>([]); // any[] を ICDItem[] に変更
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.error || 'Unknown error'}`);
      }
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        console.error('API response did not contain an array for results:', data);
        setResults([]);
        setError('データの読み込みに失敗しました。');
      }
    } catch (err) { // any を削除し、型推論に任せるか、Error型を明示
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Search failed:', err);
      setResults([]);
      setError(`検索中にエラーが発生しました: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">ICDコード検索システム</h1>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-800"
            placeholder="ICDコードや分類名で検索... (例: F7, 精神, 6A00)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>
        {error && <p className="text-red-600 text-center mt-2">エラー: {error}</p>}
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {loading && <p className="text-center text-gray-600 text-lg">検索結果を読み込み中...</p>}
        {!loading && !error && results.length === 0 && query && <p className="text-center text-gray-600 text-lg">検索結果が見つかりませんでした。</p>}
        {!loading && !error && results.length === 0 && !query && <p className="text-center text-gray-600 text-lg">検索キーワードを入力してください。</p>}

        {!loading && !error && results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">ICD10 コード</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">ICD10 分類名</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">ICD11 コード</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">ICD11 分類名</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{item.ICD10_Code || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{item.ICD10_Name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{item.ICD11_Code || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{item.ICD11_Name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
