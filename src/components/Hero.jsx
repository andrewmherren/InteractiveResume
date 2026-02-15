import React, { useState, useEffect } from 'react';

const Hero = () => {
    const roles = [
        "Architected for enterprise healthcare scale",
        "Built systems that survived acquisition",
        "Full-stack pragmatist",
        "AWS + healthcare compliance",
        "From MVP to enterprise product"
    ];

    const [currentRole, setCurrentRole] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Typing effect
    useEffect(() => {
        const role = roles[currentRole];
        const timeout = setTimeout(() => {
            if (isDeleting) {
                if (displayText.length > 0) {
                    // delete a character
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    // everything deleted, switch back to not deleting
                    // and choose new role
                    setIsDeleting(false);
                    setCurrentRole((prev) => (prev + 1) % roles.length);
                }
            } else {
                if (displayText.length < role.length) {
                    // add a character
                    setDisplayText(role.slice(0, displayText.length + 1));
                } else {
                    // finished typing, start deleting after a pause
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            }
        }, isDeleting ? 30 : 80);

        // cleanup timer
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentRole]);

    return (
        <div className="relative z-10 max-w-3xl mx-auto">
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
                        {displayText}
                        <span className="typing-cursor" />
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto lg:mx-0">
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
