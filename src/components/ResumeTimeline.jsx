import React, { useState, useEffect, useRef } from 'react';
import { experiences, education } from '../data/resumeData';

// Experience shape:
// {
//     id: 1,
//     title: "Job Title",
//     company: "Company Name",
//     duration: "2023 - Present",
//     color: "from-amber-400 to-yellow-500",
//     summary: "Brief summary of the role...",
//     example: "Detailed story about an impactful project or achievement...",
//     quote: "[Optional customer/colleague testimonial]"
// }

// Education shape:
// {
//     degree: "B.S.",
//     field: "Computer Science",
//     icon: "💻"
// }

const ResumeTimeline = () => {
    const [flipped, setFlipped] = useState({});
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef({});

    const markSectionVisible = (entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        const sectionId = entry.target?.dataset?.id;
        if (!sectionId) {
            return;
        }

        setVisibleSections((prev) => ({
            ...prev,
            [sectionId]: true,
        }));
    };

    // Setup observers on timeline cards for initial fade ins
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    markSectionVisible(entry);
                }
            },
            // 20% visibility threshold
            { threshold: 0.2 }
        );

        // observe all resume sections
        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        // cleanup observer on unmount
        return () => observer.disconnect();
    }, []);

    const toggleFlip = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section className="py-5 md:py-6 px-4 relative">
            {/* Background decoration */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden md:block" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold mb-4 gradient-text text-center">Experience</h2>
                <p className="text-slate-400 text-center mb-16">Click any card to see the story behind it</p>

                <div className="space-y-12">
                    {experiences.map((exp, index) => {
                        const isVisible = visibleSections[exp.id]
                        const slideDirection = index % 2 === 0 ? '-translate-x-12' : 'translate-x-12'
                        const animationClasses = isVisible
                            ? 'opacity-100 translate-x-0'
                            : `opacity-0 ${slideDirection}`

                        return (
                            <div
                                key={exp.id}
                                ref={(el) => (sectionRefs.current[exp.id] = el)}
                                data-id={exp.id}
                                className={`transition-all duration-700 ${animationClasses}`}
                            >
                                {/* Timeline dot */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 glow" />

                                <button
                                    onClick={() => toggleFlip(exp.id)}
                                    className={`flip-card cursor-pointer mb-8 ${flipped[exp.id] ? 'flipped' : ''}`}
                                    aria-label={`${flipped[exp.id] ? 'Hide' : 'Show'} detailed story for ${exp.title} at ${exp.company}`}
                                >
                                    <div className="flip-card-inner">
                                        {/* Front of card */}
                                        <div className="flip-card-front glass rounded-2xl p-6 hover-lift">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-slate-300 text-lg mt-1">{exp.company}</p>
                                                </div>
                                                <span className="text-sm text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            <p className="text-slate-200 leading-relaxed">{exp.summary}</p>
                                            <div className="mt-6 flex items-center text-amber-400 text-sm">
                                                <span>Click to see the story</span>
                                                <svg className="w-4 h-4 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Back of card */}
                                        <div className="flip-card-back glass rounded-2xl p-8 bg-gradient-to-br from-amber-950/80 to-orange-950/80">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-slate-200">
                                                    The Story
                                                </h3>
                                                <span className="text-xs text-slate-500">{exp.company}</span>
                                            </div>
                                            <p className="text-slate-100 leading-relaxed text-lg">{exp.example}</p>
                                            <div className="mt-6 flex items-center text-slate-400 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                                </svg>
                                                <span>Back to overview</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Education */}
                <div
                    ref={(el) => (sectionRefs.current['education'] = el)}
                    data-id="education"
                    className={`mt-24 transition-all duration-700 ${visibleSections['education'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                >
                    <h3 className="text-4xl font-bold mb-12 gradient-text text-center">Education</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {education.map((edu, idx) => (
                            <div
                                key={edu.field}
                                className="glass rounded-2xl p-6 text-center hover-lift"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="text-4xl mb-4">{edu.icon}</div>
                                <p className="font-bold text-xl gradient-text">{edu.degree}</p>
                                <p className="text-slate-300 mt-2">{edu.field}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default ResumeTimeline;
