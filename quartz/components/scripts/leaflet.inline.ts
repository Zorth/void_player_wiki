import { pathToRoot, FullSlug } from "../../util/path"

async function loadLeaflet() {
  if (window.L) return window.L

  // Load CSS
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link")
    link.id = "leaflet-css"
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
  }

  // Load JS
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => resolve(window.L)
    document.head.appendChild(script)
  })
}

// Minimal YAML parser for Leaflet config
function parseYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = yaml.split("\n")
  for (const line of lines) {
    const match = line.match(/^\s*(\w+):\s*(.*)$/)
    if (match) {
      const [_, key, value] = match
      let trimmedValue = value.trim()
      // Remove [[ ]] from links
      if (trimmedValue.startsWith("[[") && trimmedValue.endsWith("]]")) {
        trimmedValue = trimmedValue.slice(2, -2)
      }
      // Try to parse as number
      if (!isNaN(Number(trimmedValue)) && trimmedValue !== "") {
        result[key] = Number(trimmedValue)
      } else if (trimmedValue === "true") {
        result[key] = true
      } else if (trimmedValue === "false") {
        result[key] = false
      } else {
        result[key] = trimmedValue
      }
    }
  }
  return result
}

function getImageDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.width, h: img.height })
    img.onerror = reject
    img.src = url
  })
}

async function renderLeaflet() {
  const slug = document.body.dataset.slug as FullSlug
  const root = pathToRoot(slug)
  const nodes = document.querySelectorAll("code.language-leaflet") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  const L = (await loadLeaflet()) as any

  for (const node of nodes) {
    const pre = node.parentElement as HTMLPreElement
    if (pre.dataset.processed) continue
    pre.dataset.processed = "true"

    const config = parseYaml(node.innerText)
    const container = document.createElement("div")
    container.style.height = config.height || "500px"
    container.style.width = config.width || "100%"
    container.style.margin = "1rem 0"
    container.classList.add("leaflet-map-container")
    
    // Hide the original code block
    pre.style.display = "none"
    pre.after(container)

    let map: any
    
    if (config.image) {
      // Image map (Simple CRS)
      // Resolve image path. Obsidian Leaflet often uses just the filename.
      // We assume it's relative to root/public/ (standard Quartz assets)
      // or we might need to find it in the content.
      const imageUrl = config.image.startsWith("http") ? config.image : `${root}/${config.image}`
      
      try {
        const { w, h } = await getImageDimensions(imageUrl)
        map = L.map(container, {
          crs: L.CRS.Simple,
          minZoom: config.minZoom || -2,
        })

        const bounds = [
          [0, 0],
          [h, w],
        ] as any
        L.imageOverlay(imageUrl, bounds).addTo(map)
        map.fitBounds(bounds)
        
        if (config.lat !== undefined && config.long !== undefined) {
            map.setView([config.lat, config.long], config.defaultZoom || 0)
        }
      } catch (e) {
        console.error("Failed to load map image:", imageUrl, e)
        container.innerText = "Failed to load map image: " + imageUrl
        continue
      }
    } else {
      // Tile map
      map = L.map(container).setView(
        [config.lat || 0, config.long || 0],
        config.defaultZoom || 2
      )
      
      const tileLayer = config.tileLayer || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      const attribution = config.tileLayerAttribution || "&copy; OpenStreetMap"
      
      L.tileLayer(tileLayer, {
        attribution: attribution,
        maxZoom: config.maxZoom || 18,
        minZoom: config.minZoom || 0,
      }).addTo(map)
    }

    // Add markers if present (basic support)
    // Obsidian Leaflet stores markers in a separate way often, 
    // but some configs might have them. 
    // This is a placeholder for future expansion.

    window.addCleanup(() => {
        map.remove()
        container.remove()
        pre.style.display = "block"
        delete pre.dataset.processed
    })
  }
}

document.addEventListener("nav", renderLeaflet)
window.addCleanup(() => {
  document.removeEventListener("nav", renderLeaflet)
})
