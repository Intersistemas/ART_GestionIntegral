Param(
    [Parameter(Mandatory=$true)]
    [string]$SitePath,

    [switch]$RestartIIS
)

# Back up existing web.config if present
$dest = Join-Path $SitePath 'web.config'
$example = Join-Path $PSScriptRoot '..\web.config.example'
$example = (Resolve-Path $example).ProviderPath

if (-not (Test-Path $SitePath)) {
    Write-Error "Site path '$SitePath' does not exist."
    exit 1
}

if (Test-Path $dest) {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $backup = "$dest.$timestamp.bak"
    Write-Host "Backing up existing web.config to $backup"
    Copy-Item -Path $dest -Destination $backup -Force
}

Write-Host "Copying web.config.example to $dest"
Copy-Item -Path $example -Destination $dest -Force

if ($RestartIIS) {
    Write-Host "Restarting IIS"
    iisreset
}

Write-Host "Done."
