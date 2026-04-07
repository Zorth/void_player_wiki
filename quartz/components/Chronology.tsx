import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/chronology.scss"

const Chronology: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const currentSlug = fileData.slug!
  
  // Only show for Session Reports
  if (!currentSlug.startsWith("Session-Reports/")) {
    return null
  }

  // Find all files in the same folder
  const parentFolder = currentSlug.split("/").slice(0, -1).join("/")
  const siblings = allFiles
    .filter((f) => f.slug?.startsWith(parentFolder + "/") && f.slug !== parentFolder)
    .sort((a, b) => {
      const dateA = a.dates?.created?.getTime() || 0
      const dateB = b.dates?.created?.getTime() || 0
      return dateA - dateB
    })

  const currentIndex = siblings.findIndex((f) => f.slug === currentSlug)
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  if (!prev && !next) {
    return null
  }

  return (
    <div class="chronology">
      {prev ? (
        <a class="prev" href={resolveRelative(currentSlug as FullSlug, prev.slug as SimpleSlug)}>
          <span class="label">← Previous Session</span>
          <span class="title">{prev.frontmatter?.title || prev.slug}</span>
        </a>
      ) : (
        <div class="empty" />
      )}
      {next ? (
        <a class="next" href={resolveRelative(currentSlug as FullSlug, next.slug as SimpleSlug)}>
          <span class="label">Next Session →</span>
          <span class="title">{next.frontmatter?.title || next.slug}</span>
        </a>
      ) : (
        <div class="empty" />
      )}
    </div>
  )
}

Chronology.css = style

export default (() => Chronology) satisfies QuartzComponentConstructor
