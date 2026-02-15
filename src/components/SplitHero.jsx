import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import GodotTeaser from './GodotTeaser'
import GodotInfoPanel from './GodotInfoPanel'
import { useGodotSelection } from '../hooks/useGodotSelection'

const floatingKeywords = [
    { text: 'AWS', className: 'top-16 left-[8%] text-amber-400/40' },
    { text: 'React', className: 'top-32 right-[10%] text-yellow-400/40' },
    { text: 'Laravel', className: 'bottom-44 left-[18%] text-orange-400/40' },
    { text: 'Systems', className: 'top-52 left-[20%] text-amber-400/40' },
    { text: 'Scale', className: 'bottom-36 right-[22%] text-yellow-400/40' },
    { text: 'Pragmatic', className: 'top-24 right-[32%] text-orange-400/40' }
]

const SplitHero = () => {
    const [scrollY, setScrollY] = useState(0)
    const [themeClass, setThemeClass] = useState('theme-teal-gold')
    const { selection, activeOption, clearSelection } = useGodotSelection()

    const themes = [
        { value: 'theme-teal-gold', label: 'Teal/Gold' },
        { value: 'theme-walnut-brass', label: 'Walnut/Brass' },
        { value: 'theme-charcoal-chrome', label: 'Charcoal/Chrome' }
    ]

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className="split-hero min-h-screen flex items-center justify-center px-4 gradient-bg relative overflow-hidden">
            {floatingKeywords.map((keyword, index) => (
                <span
                    key={keyword.text}
                    className={`absolute text-2xl md:text-4xl font-bold pointer-events-none select-none ${keyword.className} float ${index % 2 === 0 ? 'float-delay-1' : 'float-delay-2'}`}
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                >
                    {keyword.text}
                </span>
            ))}

            <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 bg-yellow-500/20 rounded-full blur-3xl" />

            <div className="theme-switch">
                <button className="theme-switch-trigger" type="button">
                    Theme
                </button>
                <div className="theme-switch-panel">
                    {themes.map((theme) => (
                        <button
                            key={theme.value}
                            type="button"
                            className={`theme-switch-option ${themeClass === theme.value ? 'is-active' : ''}`}
                            onClick={() => setThemeClass(theme.value)}
                        >
                            {theme.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.05fr,0.95fr] gap-10 lg:gap-12 items-start">
                <div className="order-2 lg:order-1">
                    <Hero />
                </div>
                <div className={`order-1 lg:order-2 flex flex-col gap-6 ${themeClass}`}>
                    <GodotTeaser themeClass={themeClass} />
                    <GodotInfoPanel
                        activeOption={activeOption}
                        selection={selection}
                        onClear={clearSelection}
                    />
                </div>
            </div>
        </section>
    )
}

export default SplitHero
