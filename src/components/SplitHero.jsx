import React from 'react'
import GodotTeaser from './GodotTeaser'
import GodotInfoPanel from './GodotInfoPanel'
import { useGodotSelection } from '../hooks/useGodotSelection'

const SplitHero = () => {
    const { selection, activeOption, clearSelection } = useGodotSelection()

    return (
        <section className="tv-hero-section relative py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                    <div className="flex justify-center lg:justify-start">
                        <GodotTeaser />
                    </div>
                    <div className="flex flex-col gap-6">
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
