import React, { useState, useEffect } from 'react'
import GodotTeaser from './GodotTeaser'
import GodotInfoPanel from './GodotInfoPanel'
import { useGodotSelection } from '../hooks/useGodotSelection'

const SplitHero = () => {
    const { selection, activeOption, clearSelection } = useGodotSelection()
    const [isPanelVisible, setIsPanelVisible] = useState(false)

    // Show panel when user first clicks a zone with info
    useEffect(() => {
        if (activeOption && !isPanelVisible) {
            setIsPanelVisible(true)
        }
    }, [activeOption, isPanelVisible])

    return (
        <section className="tv-hero-section relative py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                    <div
                        className="flex justify-start transition-transform duration-700 ease-in-out"
                        style={{
                            transform: isPanelVisible ? 'translateX(0)' : 'translateX(50%)'
                        }}
                    >
                        <GodotTeaser />
                    </div>
                    <div
                        className="flex flex-col gap-6 transition-all duration-700 ease-in-out"
                        style={{
                            transform: isPanelVisible ? 'translateX(0)' : 'translateX(100%)',
                            opacity: isPanelVisible ? 1 : 0,
                            pointerEvents: isPanelVisible ? 'auto' : 'none'
                        }}
                    >
                        <GodotInfoPanel
                            activeOption={activeOption}
                            selection={selection}
                            onClear={clearSelection}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SplitHero
