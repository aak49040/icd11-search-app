import pandas as pd
import sys

excel_file_path = sys.argv[1]
csv_file_path = sys.argv[2]

# パスから引用符を削除
excel_file_path = excel_file_path.strip('"')
csv_file_path = csv_file_path.strip('"')

try:
    df = pd.read_excel(excel_file_path)
    df.to_csv(csv_file_path, index=False, encoding='utf-8')
    print(f"Successfully converted {excel_file_path} to {csv_file_path}")
except Exception as e:
    print(f"Error converting Excel file: {e}", file=sys.stderr)
    sys.exit(1)