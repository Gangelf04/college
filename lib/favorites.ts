'use client'

import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'college-cards:favorites'
const CHANGE_EVENT = 'college-cards:favorites-change'
const EMPTY: string[] = []

let cachedRaw: string | null = null
let cachedIds: string[] = EMPTY

function read(): string[] {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedIds
  cachedRaw = raw
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cachedIds = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : EMPTY
  } catch {
    cachedIds = EMPTY
  }
  return cachedIds
}

function write(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY)

  const toggle = useCallback((id: string) => {
    const current = read()
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, isFavorite }
}
