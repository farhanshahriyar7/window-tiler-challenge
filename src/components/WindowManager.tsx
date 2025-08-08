import React from 'react'
import { useWindowStore } from '../hooks/useWindowStore'
import { Window } from './Window'

export function WindowManager() {
  const windows = useWindowStore((state) => state.windows)
  const addWindow = useWindowStore((state) => state.addWindow)

  return (
    <>
      {windows.map((w) => (
        <Window key={w.id} window={w} />
      ))}

      <button
        onClick={addWindow}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-gray-600 text-white text-3xl font-bold shadow-lg hover:bg-black transition"
        aria-label="Add Window"
        title="Add Window"
      >
        +
      </button>
    </>
  )
}
