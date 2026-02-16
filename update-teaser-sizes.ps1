# Update Godot File Sizes
# Extracts file sizes from Export/ResumeTeaser.html and updates src/utils/initGodot.js

Write-Host "Updating Godot file sizes..." -ForegroundColor Cyan

$exportHtml = Get-Content -Path "Export/ResumeTeaser.html" -Raw
if ($exportHtml -match 'const GODOT_CONFIG = ({.+?});') {
    $configJson = $matches[1]
    
    # Parse the file sizes
    if ($configJson -match '"fileSizes":\s*{([^}]+)}') {
        $fileSizesStr = $matches[1]
        
        # Extract individual sizes
        if ($fileSizesStr -match '"ResumeTeaser\.pck":\s*(\d+)') {
            $pckSize = $matches[1]
        }
        if ($fileSizesStr -match '"ResumeTeaser\.wasm":\s*(\d+)') {
            $wasmSize = $matches[1]
        }
        
        Write-Host "  Found file sizes: .pck=$pckSize bytes, .wasm=$wasmSize bytes" -ForegroundColor Gray
        
        # Update src/utils/initGodot.js
        $initGodotPath = "src/utils/initGodot.js"
        $initGodotContent = Get-Content -Path $initGodotPath -Raw
        
        # Replace the fileSizes object
        $newFileSizes = @"
fileSizes: {
            'ResumeTeaser.pck': $pckSize,
            'ResumeTeaser.wasm': $wasmSize,
            '/teaser/ResumeTeaser.pck': $pckSize,
            '/teaser/ResumeTeaser.wasm': $wasmSize
        }
"@
        
        $initGodotContent = $initGodotContent -replace "fileSizes:\s*{[^}]+}", $newFileSizes
        
        Set-Content -Path $initGodotPath -Value $initGodotContent -NoNewline
        Write-Host "  Updated $initGodotPath with new file sizes" -ForegroundColor Green
    }
} else {
    Write-Host "  Could not extract file sizes from Export/ResumeTeaser.html" -ForegroundColor Yellow
}
