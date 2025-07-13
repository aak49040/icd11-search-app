import pandas as pd
import json
import sys
import os
import numpy as np

csv_file_path = "temp_icd_data.csv"
output_json_dir = "public"
output_json_path = os.path.join(output_json_dir, "parsed_icd_data.json")

try:
    # CSVファイルを読み込む。ヘッダー行をスキップし、適切な列名を指定
    df = pd.read_csv(csv_file_path, header=5, encoding='utf-8')

    # 必要な列のみを抽出（CSVの2列目から5列目まで）
    df = df.iloc[:, 1:5] 

    # 列名を分かりやすいものに変更
    df.columns = ['ICD10_Code', 'ICD10_Name', 'ICD11_Code', 'ICD11_Name']

    # 不要な行を削除（例: ヘッダー行の下の空行や、カテゴリ名だけの行など）
    # ICD10_CodeまたはICD11_CodeがNaN（空）の行を削除
    df = df.dropna(subset=['ICD10_Code', 'ICD11_Code'], how='all')

    # NaN値をNoneに変換
    records = df.to_dict(orient='records')
    for record in records:
        for key, value in record.items():
            if pd.isna(value):
                record[key] = None

    # publicディレクトリが存在しない場合は作成
    if not os.path.exists(output_json_dir):
        os.makedirs(output_json_dir)

    # 結果をJSONファイルに書き出す
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"Successfully parsed data and saved to {output_json_path}")

except Exception as e:
    print(f"Error parsing CSV file: {e}", file=sys.stderr)