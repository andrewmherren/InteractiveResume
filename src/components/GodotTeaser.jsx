import { useEffect, useRef, useState } from 'react'

function GodotTeaser() {
    const containerRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [isReady, setIsReady] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const hasTriggeredPowerOn = useRef(false)
    const readyTimestamp = useRef(null)
    const inViewTimestamp = useRef(null)

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
        let lastMouseX = 0
        let lastMouseY = 0

        function waitForGodot() {
            if (window.godotSetMousePosition) {
                initMouseTracking()
                if (checkInterval) {
                    clearInterval(checkInterval)
                }
            }
        }

        function updateGodotMousePosition(clientX, clientY) {
            const canvas = document.querySelector('#godot-canvas')
            if (!canvas) return

            // Get canvas bounding rect
            const rect = canvas.getBoundingClientRect()

            // Calculate mouse position relative to canvas
            let x = clientX - rect.left
            let y = clientY - rect.top

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

        function initMouseTracking() {
            if (isTracking) return

            const canvas = document.querySelector('#godot-canvas')
            if (!canvas) {
                console.warn('[MouseTracking] Canvas not found for mouse tracking')
                return
            }

            // Track mouse movement across entire page
            const handleMouseMove = (event) => {
                lastMouseX = event.clientX
                lastMouseY = event.clientY
                updateGodotMousePosition(lastMouseX, lastMouseY)
            }

            // Track scroll events to update mouse position relative to canvas
            const handleScroll = () => {
                updateGodotMousePosition(lastMouseX, lastMouseY)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('scroll', handleScroll, true) // Use capture to catch all scroll events
            isTracking = true

            // Return cleanup function
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('scroll', handleScroll, true)
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
        const handleReadyEvent = () => {
            readyTimestamp.current = Date.now()
            setIsReady(true)
        }
        window.addEventListener('godot-engine-ready', handleReadyEvent)

        const markReadyIfStatusGone = () => {
            const statusOverlay = document.getElementById('godot-status')
            if (!statusOverlay) {
                readyTimestamp.current = Date.now()
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

    // Track when TV container is in view
    useEffect(() => {
        if (!containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        inViewTimestamp.current = Date.now()
                        setIsInView(true)
                    }
                })
            },
            {
                threshold: 0.1, // Trigger when 10% visible
            }
        )

        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [])

    // Power on TV when both ready and in view
    useEffect(() => {
        if (isReady && isInView && !hasTriggeredPowerOn.current) {
            // Determine delay based on which condition was met first
            const readyFirst = readyTimestamp.current < inViewTimestamp.current
            const delay = readyFirst ? 1.0 : 0.0

            console.log('[GodotTeaser] Powering up TV - ready:', isReady, 'in view:', isInView)
            console.log('[GodotTeaser] Ready first:', readyFirst, '- Using delay:', delay)

            // Wait for Godot callback to be available
            const tryPowerOn = () => {
                if (window.godotStartTVPowerUp) {
                    console.log('[GodotTeaser] Calling godotStartTVPowerUp with delay:', delay)
                    window.godotStartTVPowerUp(delay)
                    hasTriggeredPowerOn.current = true
                } else {
                    console.log('[GodotTeaser] Waiting for godotStartTVPowerUp...')
                    setTimeout(tryPowerOn, 100)
                }
            }

            tryPowerOn()
        }
    }, [isReady, isInView])

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

        // Wait for hero typing to complete first phrase, then load during the pause
        const handleTypingComplete = () => {
            console.log('[GodotTeaser] Hero typing complete - loading Godot during pause')
            // Load Godot engine script during the typing pause
            if (!existingEngineScript && !document.querySelector('script[data-godot-teaser="engine"]')) {
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
        }

        window.addEventListener('hero-typing-complete', handleTypingComplete)

        return () => {
            window.removeEventListener('hero-typing-complete', handleTypingComplete)
        }
    }, [])

    const scaledWidth = GAME_WIDTH * scale
    const scaledHeight = GAME_HEIGHT * scale

    return (
        <div className="teaser-container">
            <div ref={containerRef} className="w-full">
                <div
                    className="teaser-wrapper"
                    style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                    }}
                >
                    <img
                        src="/teaser/ResumeTeaser.webp"
                        alt="Resume teaser preview"
                        className={`teaser-poster ${isReady ? 'teaser-poster-hidden' : ''}`}
                        style={{ transform: 'scale(1.02)' }}
                    />

                    <canvas
                        id="godot-canvas"
                        width={GAME_WIDTH}
                        height={GAME_HEIGHT}
                        style={{ visibility: isReady ? 'visible' : 'hidden' }}
                    >
                        Your browser does not support the canvas tag.
                    </canvas>

                    <noscript>
                        Your browser does not support JavaScript.
                    </noscript>

                    <div id="godot-status">
                        <img
                            id="godot-status-splash"
                            className="show-image--true fullsize--true use-filter--true"
                            src="/teaser/ResumeTeaser.webp"
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
