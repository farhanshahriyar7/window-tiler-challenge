import { create } from 'zustand'

export type WindowData = {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

type Store = {
  windows: WindowData[]
  addWindow: () => void
  removeWindow: (id: string) => void
}

export const useWindowStore = create<Store>((set) => ({
  windows: [],
  addWindow: () =>
    set((state) => {
      const id = crypto.randomUUID()
      const width = 300
      const height = 200
      // Keep windows inside viewport boundaries with some padding
      const x = Math.random() * (window.innerWidth - width - 20) + 10
      const y = Math.random() * (window.innerHeight - height - 20) + 10
      const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`
      return {
        windows: [
          ...state.windows,
          { id, x, y, width, height, color }
        ]
      }
    }),
  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id)
    })),
}))
