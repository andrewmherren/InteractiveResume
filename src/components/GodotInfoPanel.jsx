import React from 'react'

const GodotInfoPanel = ({ activeOption, selection, onClear }) => {
    const hasSelection = Boolean(activeOption || selection)

    const handleScroll = () => {
        const target = document.getElementById(activeOption?.cta?.targetId || 'experience')
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <aside className="godot-panel glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Godot Selection
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-100 mt-2">
                        {activeOption?.title || 'Tap the TV to explore'}
                    </h3>
                </div>
                {hasSelection ? (
                    <button
                        className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
                        onClick={onClear}
                        type="button"
                    >
                        Clear
                    </button>
                ) : null}
            </div>

            <p className="text-slate-300 mt-4 leading-relaxed">
                {activeOption?.summary ||
                    'Click any glowing zone on the Godot teaser to reveal a short story and jump into the experience timeline.'}
            </p>

            {activeOption ? (
                <div className="mt-5 space-y-2 text-sm text-slate-300">
                    {activeOption.bullets.map((bullet, index) => (
                        <div key={index} className="flex gap-2">
                            <span className="text-amber-300">●</span>
                            <span>{bullet}</span>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs text-amber-300/80 tracking-[0.2em] uppercase">
                    {activeOption?.label || 'Ready'}
                </span>
                <button
                    className="rounded-full bg-amber-400/20 px-4 py-2 text-sm text-amber-200 hover:bg-amber-400/30 transition-colors"
                    type="button"
                    onClick={handleScroll}
                >
                    {activeOption?.cta?.label || 'See the timeline'}
                </button>
            </div>
        </aside>
    )
}

export default GodotInfoPanel
