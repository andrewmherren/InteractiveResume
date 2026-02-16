import React from 'react'
import PropTypes from 'prop-types'

const GodotInfoPanel = ({ activeOption, onClear }) => {
    if (!activeOption) {
        return null
    }

    return (
        <aside key={activeOption.zone} className="godot-panel glass rounded-2xl p-6 panel-change-animate">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-semibold text-slate-100 mt-2">
                        {activeOption?.title}
                    </h3>
                </div>
                <button
                    className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
                    onClick={onClear}
                    type="button"
                >
                    Clear
                </button>
            </div>

            <p className="text-slate-300 mt-4 leading-relaxed">
                {activeOption.summary}
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-300">
                {activeOption.bullets.map((bullet) => (
                    <div key={bullet} className="flex gap-2">
                        <span className="text-amber-300">●</span>
                        <span>{bullet}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs text-amber-300/80 tracking-[0.2em] uppercase">
                    {activeOption.label}
                </span>
            </div>
        </aside>
    )
}

GodotInfoPanel.propTypes = {
    activeOption: PropTypes.shape({
        zone: PropTypes.string,
        title: PropTypes.string,
        summary: PropTypes.string,
        bullets: PropTypes.arrayOf(PropTypes.string),
        label: PropTypes.string
    }),
    onClear: PropTypes.func
}

export default GodotInfoPanel
