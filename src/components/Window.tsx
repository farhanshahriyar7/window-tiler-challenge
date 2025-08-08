import React, { useRef, useEffect } from 'react'
import { useWindowStore } from '../hooks/useWindowStore'

interface WindowProps {
  windowData: {
    id: string
    title?: string
    width: number
    height: number
    x: number
    y: number
    color: string
  }
}

export function Window({ windowData }: WindowProps) {
  const removeWindow = useWindowStore((state) => state.removeWindow)
  const updateWindowPosition = useWindowStore((state) => state.updateWindowPosition)

  const dragging = useRef(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; windowX: number; windowY: number } | null>(null)

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: windowData.x,
      windowY: windowData.y,
    }
    e.preventDefault() // text selection while dragging
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current || !dragStart.current) return

    const deltaX = e.clientX - dragStart.current.mouseX
    const deltaY = e.clientY - dragStart.current.mouseY

    updateWindowPosition(windowData.id, dragStart.current.windowX + deltaX, dragStart.current.windowY + deltaY)
  }

  function onMouseUp() {
    dragging.current = false
    dragStart.current = null
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div
      className="absolute rounded shadow-lg flex flex-col"
      style={{
        width: windowData.width,
        height: windowData.height,
        left: windowData.x,
        top: windowData.y,
      }}
    >
      {/* Top Bar */}
      <div
        className="flex justify-end bg-gray-800 px-3 py-1 rounded-t select-none cursor-move"
        style={{ height: 32 }}
        onMouseDown={onMouseDown}
      >
        <button
          onClick={() => removeWindow(windowData.id)}
          className="text-white font-bold bg-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
          aria-label="Close Window"
          title="Close Window"
          onMouseDown={(e) => e.stopPropagation()} // drag when clicking close
        >
          ×
        </button>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 p-4 rounded-b select-text"
        style={{ backgroundColor: windowData.color, color: '#1e293b' }}
      >
        <p>ID: {windowData.id}</p>
        {windowData.title && <p>{windowData.title}</p>}
      </div>
    </div>
  )
}
