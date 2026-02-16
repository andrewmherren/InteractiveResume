# Update Godot Teaser Script
# Copies teaser CSS from src/teaser and Export files to public/teaser

Write-Host "Updating Godot teaser..." -ForegroundColor Cyan

# Copy files to public/teaser
New-Item -ItemType Directory -Path "public/teaser" -Force | Out-Null

# Copy only CSS (godot-loader.js is now in src/utils/initGodot.js)
Copy-Item -Path "src/teaser/godot-teaser.css" -Destination "public/teaser" -Force
Copy-Item -Path "Export/ResumeTeaser.js", "Export/ResumeTeaser.pck", "Export/ResumeTeaser.wasm", "Export/ResumeTeaser.audio.worklet.js", "Export/ResumeTeaser.audio.position.worklet.js" -Destination "public/teaser" -Force -ErrorAction SilentlyContinue

Write-Host "Teaser files copied successfully!" -ForegroundColor Green

# Update file sizes in initGodot.js
& "./update-teaser-sizes.ps1"
