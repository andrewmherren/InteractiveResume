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
            "ResumeTeaser.pck": 16077392,
            "ResumeTeaser.wasm": 35740641,
            "/teaser/ResumeTeaser.pck": 16077392,
            "/teaser/ResumeTeaser.wasm": 35740641
        },
        "focusCanvas": false,
        "gdextensionLibs": [],
        "godotPoolSize": 4,
        "mainPack": `${basePath}.pck`
    };

    const GODOT_THREADS_ENABLED = false;
    const engine = new Engine(GODOT_CONFIG);

    const statusOverlay = document.getElementById('godot-status');
    const statusProgress = document.getElementById('godot-status-progress');
    const statusNotice = document.getElementById('godot-status-notice');

    let initializing = true;
    let statusMode = '';

    function setStatusMode(mode) {
        if (statusMode === mode || !initializing) {
            return;
        }
        if (mode === 'hidden') {
            statusOverlay.remove();
            initializing = false;
            return;
        }
        statusOverlay.style.visibility = 'visible';
        statusProgress.style.display = mode === 'progress' ? 'block' : 'none';
        statusNotice.style.display = mode === 'notice' ? 'block' : 'none';
        statusMode = mode;
    }

    function setStatusNotice(text) {
        while (statusNotice.lastChild) {
            statusNotice.lastChild.remove();
        }
        const lines = text.split('\n');
        lines.forEach((line) => {
            statusNotice.appendChild(document.createTextNode(line));
            statusNotice.appendChild(document.createElement('br'));
        });
    }

    function displayFailureNotice(err) {
        console.error(err);
        if (err instanceof Error) {
            setStatusNotice(err.message);
        } else if (typeof err === 'string') {
            setStatusNotice(err);
        } else {
            setStatusNotice('An unknown error occurred.');
        }
        setStatusMode('notice');
        initializing = false;
    }

    const missing = Engine.getMissingFeatures({
        threads: GODOT_THREADS_ENABLED,
    });

    if (missing.length === 0) {
        setStatusMode('progress');
        engine.startGame({
            'onProgress': function (current, total) {
                if (current > 0 && total > 0) {
                    statusProgress.value = current;
                    statusProgress.max = total;
                } else {
                    statusProgress.removeAttribute('value');
                    statusProgress.removeAttribute('max');
                }
            },
        }).then(() => {
            setStatusMode('hidden');
        }, displayFailureNotice);
    } else if (GODOT_CONFIG['serviceWorker'] && GODOT_CONFIG['ensureCrossOriginIsolationHeaders'] && 'serviceWorker' in navigator) {
        const serviceWorkerRegistrationPromise = navigator.serviceWorker
            .getRegistration()
            .catch(() => {
                throw new Error('Service worker registration failed.');
            });
        Promise.race([
            serviceWorkerRegistrationPromise.then((registration) => {
                if (registration != null) {
                    throw new Error('Service worker already exists.');
                }
                return registration;
            }).then(() => engine.installServiceWorker()),
            new Promise((resolve) => {
                setTimeout(() => resolve(), 2000);
            }),
        ]).then(() => {
            globalThis.location.reload();
        }).catch((err) => {
            console.error('Error while registering service worker:', err);
        });
    } else {
        const missingMsg = 'Error\nThe following features required to run Godot projects on the Web are missing:\n';
        displayFailureNotice(missingMsg + missing.join('\n'));
    }
};
