import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import style from "./styles/folderCards.scss"

const FolderCards: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const currentSlug = fileData.slug!
  
  // Only show on folder index pages
  if (!currentSlug.endsWith("index") && currentSlug !== "") {
    return null
  }

  const folderPath = currentSlug === "" || currentSlug === "index" 
    ? "" 
    : currentSlug.replace(/\/index$/, "")
    
  const children = allFiles.filter((f) => {
    if (f.slug === currentSlug) return false
    if (folderPath === "") {
        return !f.slug?.includes("/")
    }
    const slugWithoutPrefix = f.slug?.startsWith(folderPath + "/") 
        ? f.slug.slice(folderPath.length + 1) 
        : null
    return slugWithoutPrefix && !slugWithoutPrefix.includes("/")
  })

  if (children.length === 0) {
    return null
  }

  return (
    <div class="folder-cards">
      {children.map((child) => (
        <a class="card" href={resolveRelative(currentSlug as FullSlug, child.slug as SimpleSlug)}>
          <div class="title">{child.frontmatter?.title || child.slug}</div>
          <div class="tags">
            {child.frontmatter?.tags?.map((tag) => (
              <span class="tag">#{tag}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  )
}

FolderCards.css = style

export default (() => FolderCards) satisfies QuartzComponentConstructor
