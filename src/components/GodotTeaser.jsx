import { useEffect, useRef, useState } from 'react'

function GodotTeaser() {
    const containerRef = useRef(null)
    const [scale, setScale] = useState(1)

    // Original game dimensions
    const GAME_WIDTH = 1080
    const GAME_HEIGHT = 920

    // Set up the zone click handler from Godot
    useEffect(() => {
        window.handleGodotZoneClick = function (payload) {
            console.log('[GodotTeaser] Zone click received:', payload)
            try {
                window.dispatchEvent(new CustomEvent('godot-zone-click', { detail: payload }))
            } catch (e) {
                console.error('[GodotTeaser] Error dispatching event:', e)
            }
        }
    }, [])

    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return

            const containerWidth = containerRef.current.offsetWidth
            const containerHeight = globalThis.innerHeight * 0.8 // Max 80% of viewport height

            // Calculate scale to fit both width and height
            const scaleX = containerWidth / GAME_WIDTH
            const scaleY = containerHeight / GAME_HEIGHT

            // Use the smaller scale to ensure it fits
            const newScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 1

            setScale(newScale)
        }

        calculateScale()

        globalThis.addEventListener('resize', calculateScale)
        return () => globalThis.removeEventListener('resize', calculateScale)
    }, [])

    // Load Godot engine and initialize
    useEffect(() => {
        const existingEngineScript = document.querySelector('script[data-godot-teaser="engine"]')
        const existingLoaderScript = document.querySelector('script[data-godot-teaser="loader"]')

        if (existingEngineScript && existingLoaderScript) {
            return
        }

        // Load CSS once
        if (!document.querySelector('link[data-godot-teaser="styles"]')) {
            const cssLink = document.createElement('link')
            cssLink.rel = 'stylesheet'
            cssLink.href = '/teaser/godot-teaser.css'
            cssLink.dataset.godotTeaser = 'styles'
            document.head.appendChild(cssLink)
        }

        // Load loader script FIRST (sets up handler before engine loads)
        if (!existingLoaderScript) {
            const loaderScript = document.createElement('script')
            loaderScript.src = '/teaser/godot-loader.js'
            loaderScript.async = false  // Load synchronously to ensure it runs before engine
            loaderScript.dataset.godotTeaser = 'loader'
            document.body.appendChild(loaderScript)
        }

        // Load Godot engine script AFTER loader is ready
        if (!existingEngineScript) {
            const engineScript = document.createElement('script')
            engineScript.src = '/teaser/ResumeTeaser.js'
            engineScript.async = true
            engineScript.dataset.godotTeaser = 'engine'

            engineScript.onload = () => {
                // Initialize Godot
                if (globalThis.initGodotTeaser) {
                    globalThis.initGodotTeaser()
                }
            }

            document.body.appendChild(engineScript)
        }
    }, [])

    const scaledWidth = GAME_WIDTH * scale
    const scaledHeight = GAME_HEIGHT * scale

    return (
        <section className="w-full bg-slate-950 py-8 flex justify-center items-center">
            <div
                ref={containerRef}
                className="w-full max-w-screen-xl px-4"
            >
                <div
                    className="mx-auto relative overflow-hidden rounded-lg shadow-2xl bg-transparent"
                    style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                    }}
                >
                    <div
                        className="relative w-full h-full"
                    >
                        <canvas id="godot-canvas" width={GAME_WIDTH} height={GAME_HEIGHT}>
                            Your browser does not support the canvas tag.
                        </canvas>

                        <noscript>
                            Your browser does not support JavaScript.
                        </noscript>

                        <div id="godot-status">
                            <img
                                id="godot-status-splash"
                                className="show-image--true fullsize--true use-filter--true"
                                src="/teaser/ResumeTeaser.png"
                                alt="Loading..."
                            />
                            <progress id="godot-status-progress"></progress>
                            <div id="godot-status-notice"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GodotTeaser
