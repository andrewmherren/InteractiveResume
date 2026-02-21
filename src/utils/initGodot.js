/**
 * Initialize and start the Godot teaser engine.
 * Handles Engine setup, status overlay updates, and error handling.
 *
 * @returns {Promise<void>} Resolves when engine has finished loading
 */
export async function initGodot() {
    if (typeof window.Engine === 'undefined') {
        throw new Error('Godot Engine not loaded. ResumeTeaser.js must be loaded before calling initGodot().')
    }

    const basePath = '/teaser/ResumeTeaser'
    const GODOT_CONFIG = {
        args: [],
        canvas: document.getElementById('godot-canvas'),
        canvasResizePolicy: 0,
        emscriptenPoolSize: 8,
        ensureCrossOriginIsolationHeaders: true,
        executable: basePath,
        experimentalVK: false,
        fileSizes: {
            'ResumeTeaser.pck': 16167556,
            'ResumeTeaser.wasm': 37686550,
            '/teaser/ResumeTeaser.pck': 16167556,
            '/teaser/ResumeTeaser.wasm': 37686550
        },
        focusCanvas: false,
        gdextensionLibs: [],
        godotPoolSize: 4,
        mainPack: `${basePath}.pck`
    }

    const GODOT_THREADS_ENABLED = false
    const engine = new window.Engine(GODOT_CONFIG)

    const statusOverlay = document.getElementById('godot-status')
    const statusProgress = document.getElementById('godot-status-progress')
    const statusNotice = document.getElementById('godot-status-notice')

    let initializing = true
    let statusMode = ''

    function setStatusMode(mode) {
        if (statusMode === mode || !initializing) {
            return
        }
        if (mode === 'hidden') {
            statusOverlay.remove()
            initializing = false
            return
        }
        statusOverlay.style.visibility = 'visible'
        statusProgress.style.display = mode === 'progress' ? 'block' : 'none'
        statusNotice.style.display = mode === 'notice' ? 'block' : 'none'
        statusMode = mode
    }

    function setStatusNotice(text) {
        while (statusNotice.lastChild) {
            statusNotice.lastChild.remove()
        }
        const lines = text.split('\n')
        lines.forEach((line) => {
            statusNotice.appendChild(document.createTextNode(line))
            statusNotice.appendChild(document.createElement('br'))
        })
    }

    function displayFailureNotice(err) {
        console.error(err)
        if (err instanceof Error) {
            setStatusNotice(err.message)
        } else if (typeof err === 'string') {
            setStatusNotice(err)
        } else {
            setStatusNotice('An unknown error occurred.')
        }
        setStatusMode('notice')
        initializing = false
    }

    const missing = window.Engine.getMissingFeatures({
        threads: GODOT_THREADS_ENABLED
    })

    return new Promise((resolve, reject) => {
        if (missing.length === 0) {
            setStatusMode('progress')
            engine
                .startGame({
                    onProgress: function (current, total) {
                        if (current > 0 && total > 0) {
                            statusProgress.value = current
                            statusProgress.max = total
                        } else {
                            statusProgress.removeAttribute('value')
                            statusProgress.removeAttribute('max')
                        }
                    }
                })
                .then(() => {
                    setStatusMode('hidden')
                    globalThis.__godotReady = true
                    window.dispatchEvent(new CustomEvent('godot-engine-ready'))
                    resolve()
                }, (err) => {
                    displayFailureNotice(err)
                    reject(err)
                })
        } else if (
            GODOT_CONFIG.serviceWorker &&
            GODOT_CONFIG.ensureCrossOriginIsolationHeaders &&
            'serviceWorker' in navigator
        ) {
            const serviceWorkerRegistrationPromise = navigator.serviceWorker
                .getRegistration()
                .catch(() => {
                    throw new Error('Service worker registration failed.')
                })
            Promise.race([
                serviceWorkerRegistrationPromise
                    .then((registration) => {
                        if (registration != null) {
                            throw new Error('Service worker already exists.')
                        }
                        return registration
                    })
                    .then(() => engine.installServiceWorker()),
                new Promise((resolve) => {
                    setTimeout(() => resolve(), 2000)
                })
            ])
                .then(() => {
                    globalThis.location.reload()
                    resolve()
                })
                .catch((err) => {
                    console.error('Error while registering service worker:', err)
                    reject(err)
                })
        } else {
            const missingMsg =
                'Error\nThe following features required to run Godot projects on the Web are missing:\n'
            const error = new Error(missingMsg + missing.join('\n'))
            displayFailureNotice(error)
            reject(error)
        }
    })
}
