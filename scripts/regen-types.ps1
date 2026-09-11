# Load environment files
if (Test-Path .env) {
    # 2. Filter out comments (#) and blank lines, then parse key=value strings
    Get-Content .env | 
        Where-Object { $_ -match '=' -and $_ -notmatch '^\s*#' } | 
        ConvertFrom-StringData | 
        ForEach-Object {
            foreach ($key in $_.Keys) {
                    # 3. Inject variables directly into the current process environment scope
                    [System.Environment]::SetEnvironmentVariable($key, $_[$key], "Process")
            }
        }
    Write-Host "Successfully loaded environment variables from .env file." -ForegroundColor Green
} else {
    Write-Warning ".env file not found."
}

npx supabase gen types typescript --project-id $env:SUPABASE_PROJ_ID  > src/lib/database/gen-types.ts
Write-Host "Reloaded database.types.ts" -ForegroundColor Green