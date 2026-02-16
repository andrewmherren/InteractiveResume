// Hero typing carousel - rotating phrases displayed in the main hero section
export const roles = [
    "Full-stack pragmatist",
    "Built systems that survived acquisition",
    "From MVP to enterprise healthcare",
    "AWS + compliance at scale",
    "I make complicated things simple"
]

// Floating keywords animated in hero section background
export const keywords = ['Systems', 'Architecture', 'Resilience', 'Scale', 'Pragmatic', 'Ownership']

// Experience timeline - detailed career history with flip cards
export const experiences = [
    {
        id: 1,
        title: "Senior Software Engineer",
        company: "Modernizing Medicine",
        duration: "2023 - Present",
        color: "from-amber-400 to-yellow-500",
        summary: "Contributed heavily to the integration of Xtract's allergy platform into ModMed post-acquisition. Maintained and extended Laravel/React features on AWS (ECS, RDS, CloudWatch, CodeBuild, Secrets Manager). Bridged legacy architecture with ModMed platform and compliance workflows while onboarding new engineers.",
        example: "I am the primary technical point of contact for the acquired system. I support cloud teams migrating services into ModMed's AWS, help compliance teams map security practices, and onboard new engineers into a legacy codebase. Most days involve juggling dev work, customer issues, and architectural decisions in parallel."
    },
    {
        id: 2,
        title: "Chief Architect",
        company: "Xtract Solutions",
        duration: "2015 - 2022",
        color: "from-yellow-500 to-orange-500",
        summary: "Designed and architected modular, HIPAA-compliant SaaS platform for enterprise healthcare scale. Built domain-specific state machines enabling customizable clinical workflows without code duplication. Established CI/CD pipelines supporting rapid iteration. Product acquired by Modernizing Medicine.",
        example: "Our product's biggest strength — a rigid predefined workflow — was also its biggest limitation. I decomposed the system into the smallest meaningful domain actions and built a composable framework to orchestrate them into client-defined workflows. This allowed us to support radically different clinical processes without forking code, dramatically improving flexibility while preserving maintainability and compliance."
    },
    {
        id: 3,
        title: "Failure Analysis Engineer",
        company: "Xerox",
        duration: "2006 - 2015",
        color: "from-orange-500 to-amber-600",
        summary: "Spent nearly a decade diagnosing complex, low-reproducibility failures in large-scale electromechanical systems. Specialized in building custom diagnostics and investigative tooling to make invisible system behavior observable and debuggable.",
        example: "A particularly difficult software failure occurred frequently across the fleet but rarely on any single machine. I built a tiny Arduino-based serial logger that recorded diagnostic data to an SD card and could be discreetly deployed in the field. The data from these devices gave the software team the visibility they needed to identify the root cause, and the tool was later reused across other product lines."
    },
]

// Testimonial section - displayed between experience and education
export const testimonial = {
    text: "As part of the missing jet project, I have had the opportunity to work closely with Andrew Herren. I have found him to have the qualities which we should proactively proliferate within our organization. Things like technical competence, work ethic, and attitude are but the foundation of this culture that I personally value. Andrew also possesses things which I find to be rare and unique and include true camaraderie, passion, and selflessness to the team and the project. He works for Xerox and does things that help the team and the company AND he does not expect credit, but he deserves a lot.",
    attribution: "Trevor Snyder",
    title: "Principal Engineer",
    company: "Xerox"
}

// Education section - degrees displayed at bottom of experience timeline
export const education = [
    { degree: "B.S.", field: "Electrical Engineering", icon: "⚡" },
    { degree: "B.S.", field: "Computer Engineering", icon: "🕹️" },
    { degree: "B.S.", field: "Computer Science", icon: "💻" },
]
