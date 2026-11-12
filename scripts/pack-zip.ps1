$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Get-Location).Path
$stageDir = Join-Path $env:TEMP "unavulink_stage_$([System.Guid]::NewGuid().ToString('N'))"
$publicZip = Join-Path $root 'public\unavulink-complete-project.zip'
$distZip = Join-Path $root 'dist\unavulink-complete-project.zip'

if (Test-Path $publicZip) { Remove-Item $publicZip -Force }
if (Test-Path $distZip) { Remove-Item $distZip -Force }

New-Item -ItemType Directory -Path $stageDir -Force | Out-Null

$items = Get-ChildItem -Path $root | Where-Object {
    $_.Name -ne 'node_modules' -and
    $_.Name -ne '.git' -and
    $_.Name -ne 'dist' -and
    $_.Extension -ne '.zip'
}

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination (Join-Path $stageDir $item.Name) -Recurse -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($stageDir, $publicZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Remove-Item -Path $stageDir -Recurse -Force -ErrorAction SilentlyContinue

if (Test-Path (Join-Path $root 'dist')) {
    Copy-Item $publicZip $distZip -Force
}

$zip = Get-Item $publicZip
Write-Output "ZIP PACKAGED SUCCESSFULLY: $($zip.FullName) ($([math]::Round($zip.Length / 1MB, 2)) MB)"
