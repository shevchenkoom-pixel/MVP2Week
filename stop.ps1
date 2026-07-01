# Stop backend and frontend started by start.ps1.

$ErrorActionPreference = "SilentlyContinue"

$root = Resolve-Path (Join-Path $PSScriptRoot ".")
Set-Location $root

function Stop-One([string]$Name) {
    $pidFile = Join-Path ".run" "$Name.pid"
    if (-not (Test-Path $pidFile)) {
        Write-Host "[$Name] not running (no pid file)"
        return
    }
    $pid = Get-Content $pidFile
    if ($pid -and (Get-Process -Id $pid -ErrorAction SilentlyContinue)) {
        Stop-Process -Id $pid -Force
        Write-Host "[$Name] stopped (pid $pid)"
    } else {
        Write-Host "[$Name] pid $pid not alive"
    }
    Remove-Item $pidFile -Force
}

Stop-One "backend"
Stop-One "frontend"