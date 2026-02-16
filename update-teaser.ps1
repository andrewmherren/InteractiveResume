# Update Godot Teaser Script
# Copies teaser files from src/teaser and Export to public/teaser

Write-Host "Updating Godot teaser..." -ForegroundColor Cyan

# Copy files to public/teaser
New-Item -ItemType Directory -Path "public/teaser" -Force | Out-Null

Copy-Item -Path "src/teaser/*" -Destination "public/teaser" -Force
Copy-Item -Path "Export/ResumeTeaser.js", "Export/ResumeTeaser.pck", "Export/ResumeTeaser.wasm", "Export/ResumeTeaser.audio.worklet.js", "Export/ResumeTeaser.audio.position.worklet.js" -Destination "public/teaser" -Force -ErrorAction SilentlyContinue

Write-Host "Teaser files copied successfully!" -ForegroundColor Green

# Update file sizes in godot-loader.js
& "./update-teaser-sizes.ps1"
