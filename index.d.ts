declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
}

interface Window {
  fetchData: Promise<ContentIndex>
  spaNavigate: (url: URL, isBack: boolean) => Promise<void>
  addCleanup: (fn: (...args: any[]) => void) => void
  L: any // Leaflet
}

type ContentIndex = Record<FullSlug, ContentDetails>
