export function initConsoleSystem() {
    if (globalThis.__resumeConsoleSystemInstalled) {
        return
    }

    globalThis.__resumeConsoleSystemInstalled = true

    const helpText = `\nAvailable console commands:\n- rs.help()\n- rs.godot()\n- rs.build()\n- rs.data()\n- rs.events()\n`

    const rs = {
        help() {
            console.log(helpText)
        },
        godot() {
            console.log(`\nGodot teaser info:\n- Description: Retro TV resume teaser built in Godot game engine\n- Engine init: src/utils/initGodot.js\n- Runtime assets: public/teaser/*\n- Source CSS: src/teaser/godot-teaser.css\n- Engine boot: src/components/GodotTeaser.jsx\n\nTip: call rs.events() to see available browser events.\n`)
        },
        build() {
            console.log(`\nSite build info:\n- Entry: src/main.jsx\n- App root: src/App.jsx\n- Bundler: Vite (vite.config.js)\n- Styles: src/index.css + Tailwind config\n`)
        },
        data() {
            console.log(`\nData sources:\n- Resume timeline: src/data/resumeData.js\n- Godot panel content: src/data/godotOptions.js\n`)
        },
        events() {
            console.log(`\nGodot events you can listen to:\n- godot-engine-ready\n- godot-zone-click (detail: zone payload)\n- godot-generic-action (detail: action payload)\n\nExample:\nwindow.addEventListener('godot-zone-click', (e) => console.log(e.detail))\n`)
        }
    }

    globalThis.rs = rs

    console.log('\n')
    console.log(
        '%cHi there. Looks like you enjoy inspecting systems.',
        'font-size: 14px; color: #f97316;'
    )
    console.log('So do I, so I created a Resume System (rs) for you to investigate.')
    console.log('Type rs.help() to see what you can explore.')
}
