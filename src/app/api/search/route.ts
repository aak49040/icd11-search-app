import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 全角英数字を半角に変換するユーティリティ関数
const toHalfWidth = (str: string): string => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // 入力長の上限。正当な検索（ICDコード・分類名）は数十字以内のため、
  // 過大入力を空結果で弾く衛生措置（表示は壊さない）。
  if (query.length > 200) {
    return NextResponse.json({ results: [] });
  }

  const filePath = path.join(process.cwd(), 'public', 'parsed_icd_data.json');
  let data = [];

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error('[API] Failed to read or parse ICD data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }

  // 検索クエリを半角に変換し、小文字にする
  const processedQuery = toHalfWidth(query).toLowerCase();

  interface ICDItem {
    ICD10_Code: string | number;
    ICD10_Name: string;
    ICD11_Code: string;
    ICD11_Name: string;
  }

  const filteredResults = data.filter((item: ICDItem) => {
    // 各項目も半角に変換し、小文字にする
    const icd10Code = item.ICD10_Code ? toHalfWidth(String(item.ICD10_Code)).toLowerCase() : '';
    const icd10Name = item.ICD10_Name ? toHalfWidth(String(item.ICD10_Name)).toLowerCase() : '';
    const icd11Code = item.ICD11_Code ? toHalfWidth(String(item.ICD11_Code)).toLowerCase() : '';
    const icd11Name = item.ICD11_Name ? toHalfWidth(String(item.ICD11_Name)).toLowerCase() : '';

    return (
      icd10Code.includes(processedQuery) ||
      icd10Name.includes(processedQuery) ||
      icd11Code.includes(processedQuery) ||
      icd11Name.includes(processedQuery)
    );
  });

  return NextResponse.json({ results: filteredResults });
}
