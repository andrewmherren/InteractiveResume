// Hero typing carousel - rotating phrases displayed in the main hero section
export const roles = [
    "Architected for enterprise healthcare scale",
    "Built systems that survived acquisition",
    "Full-stack pragmatist",
    "AWS + healthcare compliance",
    "From MVP to enterprise product"
]

// Experience timeline - detailed career history with flip cards
export const experiences = [
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
]

// Education section - degrees displayed at bottom of experience timeline
export const education = [
    { degree: "B.S.", field: "Electrical Engineering", icon: "⚡" },
    { degree: "B.S.", field: "Computer Engineering", icon: "🕹️" },
    { degree: "B.S.", field: "Computer Science", icon: "💻" },
]
