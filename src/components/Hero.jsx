import React, { useState, useEffect, useRef } from 'react';
import { roles } from '../data/resumeData';

const Hero = () => {
    const textRef = useRef(null);
    const [currentRole, setCurrentRole] = useState(0);
    const displayText = useRef('');
    const isDeleting = useRef(false);
    const hasSignaledGodotLoad = useRef(false);

    // Typing effect using direct DOM manipulation for smoothness
    useEffect(() => {
        let timeoutId;

        const updateText = (text) => {
            displayText.current = text;
            if (textRef.current) {
                textRef.current.textContent = text;
            }
        };

        const signalGodotLoad = () => {
            if (hasSignaledGodotLoad.current) {
                return;
            }

            hasSignaledGodotLoad.current = true;
            // Use window for DOM event dispatch to keep browser intent explicit.
            window.dispatchEvent(new CustomEvent('hero-typing-complete')); // NOSONAR
        };

        const type = () => {
            const role = roles[currentRole];
            const currentText = displayText.current;

            if (isDeleting.current) {
                if (currentText.length === 0) {
                    // everything deleted, switch to next role
                    isDeleting.current = false;
                    setCurrentRole((prev) => (prev + 1) % roles.length);
                    timeoutId = setTimeout(type, 100);
                    return;
                }

                // delete a character
                updateText(currentText.slice(0, -1));
                timeoutId = setTimeout(type, 30);
                return;
            }

            if (currentText.length < role.length) {
                // add a character
                updateText(role.slice(0, currentText.length + 1));
                timeoutId = setTimeout(type, 80);
                return;
            }

            // signal Godot to load during the pause. We only actually load
            // during the first pause but we signal during each pause and let
            // godot code ignore subsequent signals in case of any timing issues with the first one
            signalGodotLoad();
            // finished typing, start deleting after a pause
            isDeleting.current = true;
            timeoutId = setTimeout(type, 2000);
        };

        timeoutId = setTimeout(type, 100);

        return () => clearTimeout(timeoutId);
    }, [displayText, isDeleting, currentRole]);

    return (
        <div className="relative z-10 w-full max-w-3xl mx-auto">
            <div className="stagger-children">
                <div className="mb-8 flex justify-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-amber-500/50 glow">
                        <img
                            src="/photo.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover object-[-2px_center] scale-103" // slight scale and zoom to tailor image
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-4xl font-bold">AH</div>';
                            }}
                        />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-center mb-4">
                    <span className="gradient-text text-glow">Systems Builder</span>
                </h1>

                <div id="hero-typing-text" className="h-16 md:h-20 flex items-center justify-center mb-8">
                    <p className="text-xl md:text-3xl text-slate-300 text-center">
                        <span ref={textRef}></span>
                        <span className="typing-cursor" />
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-2xl mx-auto px-12 md:px-18">
                    <button
                        className="glass rounded-xl p-4 text-center hover-lift cursor-pointer"
                        onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
                        aria-label="View experience section - 18+ years of experience"
                    >
                        <div className="text-3xl md:text-4xl font-bold gradient-text">18+</div>
                        <div className="text-xs md:text-sm text-slate-400">Years Experience</div>
                    </button>
                    <button
                        className="glass rounded-xl p-4 text-center hover-lift cursor-pointer"
                        onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
                        aria-label="View experience section - 1 successful exit"
                    >
                        <div className="text-3xl md:text-4xl font-bold gradient-text">1</div>
                        <div className="text-xs md:text-sm text-slate-400">Successful Exit</div>
                    </button>
                    <button
                        className="glass rounded-xl p-4 text-center hover-lift cursor-pointer"
                        onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
                        aria-label="View experience section - 3 engineering degrees"
                    >
                        <div className="text-3xl md:text-4xl font-bold gradient-text">3</div>
                        <div className="text-xs md:text-sm text-slate-400">Engineering Degrees</div>
                    </button>
                </div>

                <div className="flex gap-6 justify-center">
                    <a
                        href="https://github.com/andrewmherren"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-amber-400 transition-colors text-lg"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/andrewmherren/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-amber-400 transition-colors text-lg"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
