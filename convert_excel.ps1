$excelFilePath = "C:\Users\cck59\OneDrive\デスクトップ\新しいフォルダー\仮ICD対応表.xlsx"
$csvFilePath = "C:\Users\cck59\handmade-accessory-shop\temp_icd_data.csv"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false

try {
    $workbook = $excel.Workbooks.Open($excelFilePath)
    $worksheet = $workbook.Worksheets.Item(1) # 最初のシートを対象
    $worksheet.SaveAs($csvFilePath, 6) # 6 は xlCSV の値
    $workbook.Close($false)
    Write-Host "Successfully converted $excelFilePath to $csvFilePath"
} catch {
    Write-Error "Error converting Excel file: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
    Remove-Variable excel
}

