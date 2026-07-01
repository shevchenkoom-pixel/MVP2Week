# Start backend (FastAPI via uv) and frontend (Next.js dev server).
# Writes PIDs to .run/ and logs to logs/.

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot ".")
Set-Location $root

New-Item -ItemType Directory -Force -Path logs,.run | Out-Null

function Start-One([string]$Name, [string]$WorkDir, [string[]]$Args) {
    $pidFile = Join-Path ".run" "$Name.pid"
    if (Test-Path $pidFile) {
        $existing = Get-Content $pidFile -ErrorAction SilentlyContinue
        if ($existing -and (Get-Process -Id $existing -ErrorAction SilentlyContinue)) {
            Write-Host "[$Name] already running (pid $existing)"
            return
        }
    }
    $logFile = Join-Path "logs" "$Name.log"
    $proc = Start-Process -FilePath $Args[0] -ArgumentList ($Args[1..($Args.Length - 1)] -join ' ') `
        -WorkingDirectory $WorkDir -RedirectStandardOutput $logFile `
        -RedirectStandardError $logFile -NoNewWindow -PassThru
    Set-Content -Path $pidFile -Value $proc.Id
    Write-Host "[$Name] started (pid $($proc.Id))"
}

Start-One "backend" "backend" @("uv","run","uvicorn","app.main:app","--host","127.0.0.1","--port","8000")
Start-One "frontend" "frontend" @("npm","run","dev","--","--port","3000")

Write-Host ""
Write-Host "Backend  http://127.0.0.1:8000"
Write-Host "Frontend http://127.0.0.1:3000"