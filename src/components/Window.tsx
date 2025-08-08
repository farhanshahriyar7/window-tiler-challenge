import React from 'react'
import { useWindowStore } from '../hooks/useWindowStore'

interface WindowProps {
  window: {
    id: string
    title?: string
    width: number
    height: number
    x: number
    y: number
    color: string
  }
}

export function Window({ window }: WindowProps) {
  const removeWindow = useWindowStore((state) => state.removeWindow)

  return (
    <div
      className="absolute rounded shadow-lg flex flex-col"
      style={{
        width: window.width,
        height: window.height,
        left: window.x,
        top: window.y,
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-end bg-gray-800 px-3 py-1 rounded-t select-none" style={{ height: 32 }}>
        <button
          onClick={() => removeWindow(window.id)}
          className="text-white font-bold bg-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
          aria-label="Close Window"
          title="Close Window"
        >
          x
        </button>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 p-4 rounded-b select-text"
        style={{ backgroundColor: window.color, color: '#1e293b' /* dark text for contrast */ }}
      >
        <p>ID: {window.id}</p>
        {window.title && <p>{window.title}</p>}
      </div>
    </div>
  )
}
