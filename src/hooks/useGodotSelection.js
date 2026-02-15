import { useEffect, useMemo, useState } from 'react'
import { GODOT_OPTIONS } from '../data/godotOptions'

const buildOptionMaps = (options) => {
    const byZone = new Map()
    const byActionData = new Map()

    options.forEach((option) => {
        if (option.zone) {
            byZone.set(option.zone, option)
        }
        if (option.actionData) {
            byActionData.set(option.actionData, option)
        }
    })

    return { byZone, byActionData }
}

export const useGodotSelection = () => {
    const [selection, setSelection] = useState(null)
    const [activeOption, setActiveOption] = useState(null)

    const optionMaps = useMemo(() => buildOptionMaps(GODOT_OPTIONS), [])

    useEffect(() => {
        const handleSelection = (event) => {
            const payload = event?.detail ?? event
            if (!payload) return

            const matchedOption =
                optionMaps.byZone.get(payload.zone_name) ||
                optionMaps.byActionData.get(payload.action_data) ||
                null

            setSelection(payload)
            setActiveOption(matchedOption)
        }

        window.addEventListener('godot-zone-click', handleSelection)
        return () => window.removeEventListener('godot-zone-click', handleSelection)
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
