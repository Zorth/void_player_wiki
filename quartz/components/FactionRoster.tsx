import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import style from "./styles/factionRoster.scss"

const FactionRoster: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
  const currentTitle = fileData.frontmatter?.title || fileData.slug?.split("/").pop()
  const tags = fileData.frontmatter?.tags || []
  const isOrganization = tags.includes("organization") || fileData.slug?.startsWith("World-Notes/Organizations/")

  if (!isOrganization) {
    return null
  }

  const members = allFiles.filter((file) => {
    const affiliations = file.frontmatter?.affiliations
    if (!affiliations || !Array.isArray(affiliations)) return false
    
    return affiliations.some((aff: string) => {
      // Clean up wikilink syntax: [[Name]] -> Name
      const cleanAff = aff.replace(/^\[\[/, "").replace(/\]\]$/, "")
      return cleanAff === currentTitle
    })
  })

  if (members.length === 0) {
    return null
  }

  return (
    <div class={`faction-roster ${displayClass ?? ""}`}>
      <hr />
      <h3>Known Members</h3>
      <div class="member-grid">
        {members.map((member) => (
          <a class="member-card" href={resolveRelative(fileData.slug as FullSlug, member.slug as SimpleSlug)}>
            <div class="member-info">
              <span class="name">{member.frontmatter?.title || member.slug?.split("/").pop()}</span>
              <span class="role">{member.frontmatter?.class ? `${member.frontmatter.class} (lvl ${member.frontmatter.lvl || "?"})` : "Member"}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

FactionRoster.css = style

export default (() => FactionRoster) satisfies QuartzComponentConstructor
