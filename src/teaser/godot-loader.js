// Godot Engine Loader


globalThis.initGodotTeaser = function () {
    const basePath = '/teaser/ResumeTeaser';
    const GODOT_CONFIG = {
        "args": [],
        "canvas": document.getElementById('godot-canvas'),
        "canvasResizePolicy": 0,
        "emscriptenPoolSize": 8,
        "ensureCrossOriginIsolationHeaders": true,
        "executable": basePath,
        "experimentalVK": false,
        "fileSizes": {
            "ResumeTeaser.pck": 16185772,
            "ResumeTeaser.wasm": 37686550,
            "/teaser/ResumeTeaser.pck": 16185772,
            "/teaser/ResumeTeaser.wasm": 37686550
        },
        "focusCanvas": false,
        "gdextensionLibs": [],
        "godotPoolSize": 4,
        "mainPack": `${basePath}.pck`
    };

    const GODOT_THREADS_ENABLED = false;
    const engine = new Engine(GODOT_CONFIG);

    const missing = Engine.getMissingFeatures({
        threads: GODOT_THREADS_ENABLED,
    });

    if (missing.length === 0) {
        // Start the game - loading progress handled by React component
        engine.startGame().then(() => {
            console.log('[Godot] Engine loaded successfully');
        }).catch((err) => {
            console.error('[Godot] Failed to load engine:', err);
        });
    } else if (GODOT_CONFIG['serviceWorker'] && GODOT_CONFIG['ensureCrossOriginIsolationHeaders'] && 'serviceWorker' in navigator) {
        // Attempt service worker installation for missing features
        navigator.serviceWorker
            .getRegistration()
            .then((registration) => {
                if (registration != null) {
                    throw new Error('Service worker already exists.');
                }
                return engine.installServiceWorker();
            })
            .then(() => {
                globalThis.location.reload();
            })
            .catch((err) => {
                console.error('[Godot] Service worker registration failed:', err);
            });
    } else {
        console.error('[Godot] Missing required features:', missing.join(', '));
    }
};
