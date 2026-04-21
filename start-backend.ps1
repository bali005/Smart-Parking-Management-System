$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"

Set-Location $backend

Write-Host "Building backend runtime classpath..." -ForegroundColor Cyan
& .\mvnw.cmd "dependency:build-classpath" "-Dmdep.outputFile=cp.txt" | Out-Host

Write-Host "Compiling backend classes..." -ForegroundColor Cyan
& .\mvnw.cmd compile | Out-Host

$cp = "target\classes;" + (Get-Content "cp.txt" -Raw)

Write-Host "Starting backend on http://localhost:7070" -ForegroundColor Green
& java "-cp" $cp "com.parking.system.ParkingSystemApplication"
