import { useEffect, useRef, useState } from 'react'

function GodotTeaser({ themeClass = 'theme-teal-gold' }) {
    const containerRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [isReady, setIsReady] = useState(false)

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

    // Set up page-level mouse tracking for Godot
    useEffect(() => {
        let isTracking = false
        let checkInterval

        function waitForGodot() {
            if (window.godotSetMousePosition) {
                initMouseTracking()
                if (checkInterval) {
                    clearInterval(checkInterval)
                }
            }
        }

        function initMouseTracking() {
            if (isTracking) return

            const canvas = document.querySelector('#godot-canvas')
            if (!canvas) {
                console.warn('[MouseTracking] Canvas not found for mouse tracking')
                return
            }

            // Track mouse movement across entire page
            const handleMouseMove = (event) => {
                // Get canvas bounding rect
                const rect = canvas.getBoundingClientRect()

                // Calculate mouse position relative to canvas
                // Even if mouse is outside canvas, we map it to canvas coordinates
                let x = event.clientX - rect.left
                let y = event.clientY - rect.top

                // Map to Godot's internal resolution (canvas size * device pixel ratio)
                const scaleX = canvas.width / rect.width
                const scaleY = canvas.height / rect.height

                x *= scaleX
                y *= scaleY

                // Send to Godot
                if (window.godotSetMousePosition) {
                    try {
                        window.godotSetMousePosition([x, y])
                    } catch (e) {
                        console.error('[MouseTracking] Error calling godotSetMousePosition:', e)
                    }
                }
            }

            document.addEventListener('mousemove', handleMouseMove)
            isTracking = true

            // Return cleanup function
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                isTracking = false
            }
        }

        // Start checking for Godot after a short delay
        const timeoutId = setTimeout(() => {
            checkInterval = setInterval(waitForGodot, 100)
        }, 500)

        // Cleanup
        return () => {
            clearTimeout(timeoutId)
            if (checkInterval) {
                clearInterval(checkInterval)
            }
        }
    }, [])

    useEffect(() => {
        const handleReadyEvent = () => setIsReady(true)
        window.addEventListener('godot-engine-ready', handleReadyEvent)

        const markReadyIfStatusGone = () => {
            const statusOverlay = document.getElementById('godot-status')
            if (!statusOverlay) {
                setIsReady(true)
                return true
            }
            return false
        }

        if (markReadyIfStatusGone()) {
            return () => window.removeEventListener('godot-engine-ready', handleReadyEvent)
        }

        const observer = new MutationObserver(() => {
            if (markReadyIfStatusGone()) {
                observer.disconnect()
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            window.removeEventListener('godot-engine-ready', handleReadyEvent)
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return

            const containerWidth = containerRef.current.offsetWidth
            const containerHeight = globalThis.innerHeight * 0.6 // Max 60% of viewport height

            // Calculate scale to fit both width and height
            const scaleX = containerWidth / GAME_WIDTH
            const scaleY = containerHeight / GAME_HEIGHT

            // Use the smaller scale to ensure it fits
            const newScale = Math.min(scaleX, scaleY, 0.65) // Max 65% scale

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
        <div className={`teaser-container ${themeClass}`}>
            <div ref={containerRef} className="w-full">
                <div
                    className="teaser-wrapper"
                    style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                    }}
                >
                    <img
                        src="/teaser/ResumeTeaser.png"
                        alt="Resume teaser preview"
                        className={`teaser-poster ${isReady ? 'teaser-poster-hidden' : ''}`}
                    />

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
    )
}

export default GodotTeaser
