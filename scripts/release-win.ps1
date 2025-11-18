[CmdletBinding()]
param(
  [string]$Mode = "production",
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")

Push-Location $projectRoot
try {
  $arguments = @("--mode", $Mode)
  if ($SkipInstall) {
    $arguments += "--skip-install"
  }
  Write-Host "Running release pipeline in $Mode mode"
  node ".\scripts\run-release.mjs" @arguments
}
finally {
  Pop-Location
}
