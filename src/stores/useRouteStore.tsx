import { defineStore } from "pinia"

export const useRouteStore = defineStore({
  id: 'routeStore',
  state: () => ({
    currentRoute: '',
    shouldPrompt: true
  }),
  actions: {
    setCurrentRoute(route: string) {
      if (route !== this.currentRoute) {
        this.currentRoute = route
        this.shouldPrompt = true
      }
    },
    setShouldPrompt(value: boolean) {
      this.shouldPrompt = value
    }
  }
})
