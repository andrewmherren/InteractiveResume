import React, { useState, useEffect, useRef } from 'react';

const ResumeTimeline = () => {
    const [flipped, setFlipped] = useState({});
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef({});

    const experiences = [
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "Modernizing Medicine",
            duration: "2023 - Present",
            color: "from-amber-400 to-yellow-500",
            summary: "Contributed heavily to the integration of Xtract's allergy platform into ModMed post-acquisition. Maintained and extended Laravel/React features on AWS (ECS, RDS, CloudWatch, CodeBuild, Secrets Manager). Bridged legacy architecture with ModMed platform and compliance workflows while onboarding new engineers.",
            example: "I found myself as the primary point of contact for all things technical. Between supporting the cloud team in transitioning services to ModMed's AWS account, helping the compliance team understand our processes, security praciteces, and where gaps might exist post transition, providing top level support for customer issues, and onboarding new engineers to the codebase I am constantly juggling multiple high priority tasks.",
            quote: "[TBD]"
        },
        {
            id: 2,
            title: "Chief Architect",
            company: "Xtract Solutions",
            duration: "2015 - 2022",
            color: "from-yellow-500 to-orange-500",
            summary: "Designed and architected modular, HIPAA-compliant SaaS platform for enterprise healthcare scale. Built domain-specific state machines enabling customizable clinical workflows without code duplication. Established CI/CD pipelines supporting rapid iteration. Product acquired by Modernizing Medicine.",
            example: "One impactful example was recognizing that our products greatest value, its rigid adherence to a predefined workflow, was also its biggest limitation. To address this, I deconstructed the workflow into the smallest functional units of work, creating a library of modular domain specific actions. I then designed a framework to orchestrate these actions into workflows defined by each client. This approach allowed us to rapidly tailor our solution to diverse client needs without duplicating code, significantly enhancing both flexibility and maintainability.",
            quote: "[TBD]"
        },
        {
            id: 3,
            title: "Failure Analysis Engineer",
            company: "Xerox",
            duration: "2006 - 2015",
            color: "from-orange-500 to-amber-600",
            summary: "Root cause analysis on flagship multifunction printer line. Diagnosed jamming issue affecting 21% of field returns and 33% of prototypes. Deployed on-site to Southeast Asia during critical line-down event with 80% production rejection.",
            example: "One story that stands out was particularly challenging software failure that was occurring with great frequency across the population of machines but at very low frequency on any individual machine. I developed a custom arduino based serial data logger roughly the size of a key fob that recorded to an SD card. These devices were deployed to service teams and could be discretely installed on units with a high likely hood of failure. Ultimately the data collected from these devices provided the necessary insights for the software team to identify the root cause. Additionally the devices continued to be used for for other problems and product lines.",
            quote: "\"As part of the missing jet project, I have had the opportunity to work closely with Andrew Herren. I have found him to have the qualities which we should proactively proliferate within our organization. Things like technical competence, work ethic, and attitude are but the foundation of this cutler that I personally value. Andrew also possesses things which I find to be rare and unique and include true comradery, passion, and selflessness to the team and the project. He works for Xerox and does things that help the team and the company AND he does not expect credit, but he deserves a lot.\" - Trevor Snyder (Principle Engineer)"
        },
    ];

    const education = [
        { degree: "B.S.", field: "Electrical Engineering", icon: "⚡" },
        { degree: "B.S.", field: "Computer Engineering", icon: "🕹️" },
        { degree: "B.S.", field: "Computer Science", icon: "💻" },
    ];

    // do initial fade ins
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // for each entry, if its visible in the viewport...
                    if (entry.isIntersecting) {
                        // mark this section as visible in state
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.dataset.id]: true,
                        }));
                    }
                });
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
        <section className="py-20 px-4 relative">
            {/* Background decoration */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden md:block" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold mb-4 gradient-text text-center">Experience</h2>
                <p className="text-slate-400 text-center mb-16">Click any card to see the story behind it</p>

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            ref={(el) => (sectionRefs.current[exp.id] = el)}
                            data-id={exp.id}
                            className={`transition-all duration-700 ${visibleSections[exp.id]
                                ? 'opacity-100 translate-x-0'
                                // alternate left/right slide-in
                                : index % 2 === 0
                                    ? 'opacity-0 -translate-x-12'
                                    : 'opacity-0 translate-x-12'
                                }`}
                        >
                            {/* Timeline dot */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 glow" />

                            <div
                                onClick={() => toggleFlip(exp.id)}
                                className={`flip-card cursor-pointer mb-8 ${flipped[exp.id] ? 'flipped' : ''}`}
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
                            </div>
                        </div>
                    ))}
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
                                key={idx}
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
