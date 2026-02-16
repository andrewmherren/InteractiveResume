import React, { useState, useEffect } from 'react'
import GodotTeaser from './GodotTeaser'
import GodotInfoPanel from './GodotInfoPanel'
import { useGodotSelection } from '../hooks/useGodotSelection'

const SplitHero = () => {
    const { selection, activeOption, clearSelection } = useGodotSelection()
    const [isPanelVisible, setIsPanelVisible] = useState(false)

    const handleGenericAction = () => {
        clearSelection()
        setIsPanelVisible(false)
    }

    // Show panel when user first clicks a zone with info
    useEffect(() => {
        if (activeOption && !isPanelVisible) {
            setIsPanelVisible(true)
        }
    }, [activeOption, isPanelVisible])

    useEffect(() => {
        // GodotTeaser.jsx will dispatch 'godot-generic-action' when the godot game calls globalThis.handleGodotGenericAction(payload)
        // when this happens we want to clear any active selection and hide the info panel to reset the UI for the next interaction
        // Use window for DOM events to keep browser intent explicit.
        window.addEventListener('godot-generic-action', handleGenericAction) // NOSONAR
        return () => {
            // Use window for DOM events to keep browser intent explicit.
            window.removeEventListener('godot-generic-action', handleGenericAction) // NOSONAR
        }
    }, [handleGenericAction])

    return (
        <section className="tv-hero-section relative py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="tv-hero-layout">
                    <div
                        className={`tv-teaser-slot ${isPanelVisible ? 'tv-teaser-shift' : ''}`}
                    >
                        <GodotTeaser isPanelVisible={isPanelVisible} />
                    </div>
                    <div
                        className={`tv-panel-slot ${isPanelVisible ? 'tv-panel-visible' : 'tv-panel-hidden'}`}
                        aria-hidden={!isPanelVisible}
                    >
                        <GodotInfoPanel
                            activeOption={activeOption}
                            selection={selection}
                            onClear={handleGenericAction}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SplitHero
