function renderTimelines() {
  const nodes = document.querySelectorAll("code.language-timeline") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  for (const node of nodes) {
    const pre = node.parentElement as HTMLPreElement
    if (pre.dataset.processed) continue
    pre.dataset.processed = "true"

    const content = node.innerText
    const lines = content.split("\n").filter(l => l.trim() !== "")
    
    const timelineContainer = document.createElement("div")
    timelineContainer.classList.add("timeline-container")

    for (const line of lines) {
      const splitIndex = line.indexOf(":")
      if (splitIndex === -1) continue

      const date = line.substring(0, splitIndex).trim()
      const event = line.substring(splitIndex + 1).trim()

      const item = document.createElement("div")
      item.classList.add("timeline-item")

      const dot = document.createElement("div")
      dot.classList.add("timeline-dot")

      const dateEl = document.createElement("div")
      dateEl.classList.add("timeline-date")
      dateEl.innerText = date

      const contentEl = document.createElement("div")
      contentEl.classList.add("timeline-content")
      contentEl.innerText = event

      item.appendChild(dot)
      item.appendChild(dateEl)
      item.appendChild(contentEl)
      timelineContainer.appendChild(item)
    }

    pre.style.display = "none"
    pre.after(timelineContainer)

    window.addCleanup(() => {
      timelineContainer.remove()
      pre.style.display = "block"
      delete pre.dataset.processed
    })
  }
}

document.addEventListener("nav", renderTimelines)
window.addCleanup(() => {
  document.removeEventListener("nav", renderTimelines)
})
