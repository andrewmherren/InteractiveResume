import { useEffect, useMemo, useState } from 'react'
import { GODOT_OPTIONS } from '../data/godotOptions'

// Godot option shape:
// {
//     zone: 'Zone1',
//     actionData: 'architecture',
//     label: 'Architecture',
//     title: 'Modular Workflow Architecture',
//     summary: 'Brief description of the feature or achievement...',
//     bullets: [
//         'Key point 1',
//         'Key point 2',
//         'Key point 3'
//     ],
//     cta: {
//         label: 'See the story',
//         targetId: 'experience'
//     }
// }

const buildOptionMaps = (options) => {
    const byZone = new Map()

    options.forEach((option) => {
        if (option.zone) {
            byZone.set(option.zone, option)
        }
    })

    return { byZone }
}

export const useGodotSelection = () => {
    const [selection, setSelection] = useState(null)
    const [activeOption, setActiveOption] = useState(null)

    const optionMaps = useMemo(() => buildOptionMaps(GODOT_OPTIONS), [])

    useEffect(() => {
        const handleSelection = (event) => {
            const payload = event?.detail ?? event
            if (!payload) return

            const matchedOption = optionMaps.byZone.get(payload.zone_name) || null

            setSelection(payload)
            setActiveOption(matchedOption)
        }

        // Use window for DOM events to keep browser intent explicit.
        window.addEventListener('godot-zone-click', handleSelection) // NOSONAR
        return () => {
            // Use window for DOM events to keep browser intent explicit.
            window.removeEventListener('godot-zone-click', handleSelection) // NOSONAR
        }
    }, [optionMaps])

    const clearSelection = () => {
        setSelection(null)
        setActiveOption(null)
    }

    return {
        selection,
        activeOption,
        clearSelection,
        options: GODOT_OPTIONS
    }
}
