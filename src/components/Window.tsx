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
  const updateWindowSize = useWindowStore((state) => state.updateWindowSize) 
  const dragging = useRef(false)
  const resizing = useRef(false) // track resizing separately
  const dragStart = useRef<{ mouseX: number; mouseY: number; windowX: number; windowY: number } | null>(null)
  const resizeStart = useRef<{ mouseX: number; mouseY: number; startWidth: number; startHeight: number } | null>(null)
  const [snapEdge, setSnapEdge] = useState<string | null>(null)
  const snapWindow = useWindowStore((state) => state.snapWindow)

  // dragging logic
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: windowData.x,
      windowY: windowData.y,
    }
    e.preventDefault()
  }

  // check the window is near an edge to snap
  function checkSnapEdge(newX: number, newY: number, width: number, height: number) {
    if (newX < 30) return 'left'
    if (window.innerWidth - (newX + width) < 30) return 'right'
    if (newY < 30) return 'top'
    if (window.innerHeight - (newY + height) < 30) return 'bottom'
    return null
  }

  // resizing logic
  function onResizeMouseDown(e: React.MouseEvent) {
    e.stopPropagation() // stop dragging
    resizing.current = true
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startWidth: windowData.width,
      startHeight: windowData.height,
    }
    e.preventDefault()
  }

  function onMouseMove(e: MouseEvent) {
    // dragging logic
    if (dragging.current && dragStart.current) {
      const win = windowData
      const deltaX = e.clientX - dragStart.current.mouseX
      const deltaY = e.clientY - dragStart.current.mouseY
      const newX = dragStart.current.windowX + deltaX
      const newY = dragStart.current.windowY + deltaY
      const edge = checkSnapEdge(newX, newY, win.width, win.height)
      setSnapEdge(edge)
      updateWindowPosition(win.id, newX, newY)
    }

    // resizing logic
    if (resizing.current && resizeStart.current) {
      const deltaX = e.clientX - resizeStart.current.mouseX
      const deltaY = e.clientY - resizeStart.current.mouseY
      const newWidth = Math.max(100, resizeStart.current.startWidth + deltaX)
      const newHeight = Math.max(80, resizeStart.current.startHeight + deltaY)
      updateWindowSize(windowData.id, newWidth, newHeight)
    }
  }

  // mouse up logic
  function onMouseUp() {
    if (dragging.current) {
      dragging.current = false
      dragStart.current = null

      if (snapEdge) {
        const win = windowData
        let newX = win.x
        let newY = win.y
        let newWidth = win.width
        let newHeight = win.height

        if (snapEdge === 'left' || snapEdge === 'right') {
          newWidth = window.innerWidth / 2
          if (snapEdge === 'left') {
            newX = 0
          } else {
            newX = window.innerWidth / 2
          }
        } else if (snapEdge === 'top' || snapEdge === 'bottom') {
          newHeight = window.innerHeight / 2
          if (snapEdge === 'top') {
            newY = 0
          } else {
            newY = window.innerHeight / 2
          }
        }

        snapWindow(windowData.id, newX, newY, newWidth, newHeight)
      }

      setSnapEdge(null)
    }

    if (resizing.current) {
      resizing.current = false
      resizeStart.current = null
    }
  }

  // mouse event listeners
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
          onMouseDown={(e) => e.stopPropagation()}
        >
          x
        </button>
      </div>

      {/* Snap indicators */}
      {snapEdge === 'left' && <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-400 opacity-50 pointer-events-none rounded-l-md" />}
      {snapEdge === 'right' && <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-400 opacity-50 pointer-events-none rounded-r-md" />}
      {snapEdge === 'top' && <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-50 pointer-events-none rounded-t-md" />}
      {snapEdge === 'bottom' && <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-400 opacity-50 pointer-events-none rounded-b-md" />}

      {/* Content */}
      <div
        className="flex-1 p-4 rounded-b select-text"
        style={{ backgroundColor: windowData.color, color: '#1e293b' }}
      >
        <p>ID: {windowData.id}</p>
        {windowData.title && <p>{windowData.title}</p>}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 cursor-se-resize rounded-tr-sm"
        onMouseDown={onResizeMouseDown}
        title="Resize"
      />
    </div>
  )
}
