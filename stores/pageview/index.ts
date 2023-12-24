import type { State } from './types'

export const usePageviewStore = defineStore('pageviewStore', {
  state: (): State => ({
    count: 0,
    lastseen: new Date(),
  }),
  getters: {
    getViews(): number {
      return this.count
    },
    getLastSeen(): Date {
      return this.lastseen
    },
  },
  actions: {
    incrementView() {
      this.count++
    },
    updateLastSeen() {
      this.lastseen = new Date()
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
