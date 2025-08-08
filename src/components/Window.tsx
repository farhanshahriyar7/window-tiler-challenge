import React, { useRef, useEffect, useState } from 'react'
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
  const [snapEdge, setSnapEdge] = useState<string | null>(null)

  // Handle drag start on top bar
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: windowData.x,
      windowY: windowData.y,
    }
    e.preventDefault() // prevent text selection
  }


  function checkSnapEdge(newX: number, newY: number, width: number, height: number) {
    if (newX < 30) return 'left'
    if (window.innerWidth - (newX + width) < 30) return 'right'
    if (newY < 30) return 'top'
    if (window.innerHeight - (newY + height) < 30) return 'bottom'
    return null
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current || !dragStart.current) return

    const win = windowData
    const deltaX = e.clientX - dragStart.current.mouseX
    const deltaY = e.clientY - dragStart.current.mouseY

    const newX = dragStart.current.windowX + deltaX
    const newY = dragStart.current.windowY + deltaY

    const edge = checkSnapEdge(newX, newY, win.width, win.height)
    setSnapEdge(edge)

    updateWindowPosition(win.id, newX, newY)
  }

  function onMouseUp() {
    dragging.current = false
    dragStart.current = null
    setSnapEdge(null) 
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
          onMouseDown={(e) => e.stopPropagation()} // prevent drag on close click
        >
          ×
        </button>
      </div>

      {/* Snap indicator bars */}
      {snapEdge === 'left' && (
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-400 opacity-50 pointer-events-none rounded-l-md" />
      )}
      {snapEdge === 'right' && (
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-400 opacity-50 pointer-events-none rounded-r-md" />
      )}
      {snapEdge === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-50 pointer-events-none rounded-t-md" />
      )}
      {snapEdge === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-400 opacity-50 pointer-events-none rounded-b-md" />
      )}

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

