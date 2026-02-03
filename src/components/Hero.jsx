import React, { useState, useEffect } from 'react';

const Hero = () => {
    const roles = [
        "Architected for enterprise healthcare scale",
        "Built systems that survived acquisition",
        "Full-stack pragmatist",
        "AWS + healthcare compliance",
        "From MVP to enterprise product"
    ];

    const floatingKeywords = [
        { text: "AWS", className: "top-20 left-[10%] text-amber-400/40" },
        { text: "React", className: "top-32 right-[15%] text-yellow-400/40" },
        { text: "Laravel", className: "bottom-40 left-[20%] text-orange-400/40" },
        { text: "Systems", className: "top-48 left-[25%] text-amber-400/40" },
        { text: "Scale", className: "bottom-32 right-[25%] text-yellow-400/40" },
        { text: "Pragmatic", className: "top-24 right-[30%] text-orange-400/40" },
    ];

    const [currentRole, setCurrentRole] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [scrollY, setScrollY] = useState(0);

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

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        // cleanup event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center px-4 gradient-bg relative overflow-hidden">
            {/* Floating background keywords */}
            {floatingKeywords.map((keyword, i) => (
                <span
                    key={i}
                    className={`absolute text-2xl md:text-4xl font-bold pointer-events-none select-none ${keyword.className} float ${i % 2 === 0 ? 'float-delay-1' : 'float-delay-2'}`}
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                >
                    {keyword.text}
                </span>
            ))}

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="stagger-children">
                    <div className="mb-8 flex justify-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-500/50 glow">
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

                    {/* Teaser cards - hints of work */}
                    <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
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
        </section>
    );
};

export default Hero;
