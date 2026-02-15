import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
    const roles = [
        "Architected for enterprise healthcare scale",
        "Built systems that survived acquisition",
        "Full-stack pragmatist",
        "AWS + healthcare compliance",
        "From MVP to enterprise product"
    ];

    const textRef = useRef(null);
    const [currentRole, setCurrentRole] = useState(0);
    const displayText = useRef('');
    const isDeleting = useRef(false);
    const hasSignaledGodotLoad = useRef(false);

    // Typing effect using direct DOM manipulation for smoothness
    useEffect(() => {
        let timeoutId;

        const type = () => {
            const role = roles[currentRole];

            if (isDeleting.current) {
                if (displayText.current.length > 0) {
                    // delete a character
                    displayText.current = displayText.current.slice(0, -1);
                    if (textRef.current) {
                        textRef.current.textContent = displayText.current;
                    }
                    timeoutId = setTimeout(type, 30);
                } else {
                    // everything deleted, switch to next role
                    isDeleting.current = false;
                    setCurrentRole((prev) => (prev + 1) % roles.length);
                    timeoutId = setTimeout(type, 100);
                }
            } else {
                if (displayText.current.length < role.length) {
                    // add a character
                    displayText.current = role.slice(0, displayText.current.length + 1);
                    if (textRef.current) {
                        textRef.current.textContent = displayText.current;
                    }
                    timeoutId = setTimeout(type, 80);
                } else {
                    // finished typing first phrase - signal Godot to load during the pause
                    if (!hasSignaledGodotLoad.current) {
                        hasSignaledGodotLoad.current = true;
                        window.dispatchEvent(new CustomEvent('hero-typing-complete'));
                        console.log('[Hero] First phrase complete - signaling Godot load');
                    }
                    // finished typing, start deleting after a pause
                    isDeleting.current = true;
                    timeoutId = setTimeout(type, 2000);
                }
            }
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
                            src="/photo1.jpg"
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

                <div className="h-16 md:h-20 flex items-center justify-center mb-8">
                    <p className="text-xl md:text-3xl text-slate-300 text-center">
                        <span ref={textRef}></span>
                        <span className="typing-cursor" />
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-2xl mx-auto px-12 md:px-18">
                    <div className="glass rounded-xl p-4 text-center hover-lift cursor-pointer" onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}>
                        <div className="text-3xl md:text-4xl font-bold gradient-text">18+</div>
                        <div className="text-xs md:text-sm text-slate-400">Years Experience</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center hover-lift cursor-pointer" onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}>
                        <div className="text-3xl md:text-4xl font-bold gradient-text">1</div>
                        <div className="text-xs md:text-sm text-slate-400">Successful Exit</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center hover-lift cursor-pointer" onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}>
                        <div className="text-3xl md:text-4xl font-bold gradient-text">3</div>
                        <div className="text-xs md:text-sm text-slate-400">Engineering Degrees</div>
                    </div>
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
