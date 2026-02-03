import React from 'react';

const Footer = () => {
    return (
        <footer className="relative py-20 px-4 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/50 to-transparent" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold gradient-text mb-4">Let's Build Something</h3>
                <p className="text-slate-400 mb-8 text-lg">
                    Looking for a versatile engineer who can architect, build, and lead?
                </p>

                <a
                    href="https://www.linkedin.com/in/andrewmherren/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all hover-lift glow"
                >
                    Contact on LinkedIn
                </a>

                <div className="flex gap-8 justify-center mt-12 mb-8">
                    <a
                        href="https://github.com/andrewmherren"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-amber-400 transition-colors font-semibold"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/andrewmherren/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-amber-400 transition-colors font-semibold"
                    >
                        LinkedIn
                    </a>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8">
                    <p className="text-slate-600 text-sm">
                        © 2026 · Andrew Herren
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
