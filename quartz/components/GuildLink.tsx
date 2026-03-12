import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const GuildLink: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "guild-link")}>
      <a href="https://guild.tarragon.be">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
        <span>The Guild</span>
      </a>
    </div>
  )
}

GuildLink.css = `
.guild-link {
  margin: 0;
}

.guild-link a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary);
  text-decoration: none;
  font-family: var(--headerFont);
  font-weight: 600;
  transition: color 0.2s ease;
}

.guild-link a:hover {
  color: var(--tertiary);
}

.guild-link svg {
  width: 1.2rem;
  height: 1.2rem;
}

.guild-link span {
  font-size: 0.95rem;
}
`

export default (() => GuildLink) satisfies QuartzComponentConstructor
