import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showAuthor: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showAuthor: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Display author if enabled and present in frontmatter
      if (options.showAuthor && fileData.frontmatter?.author) {
        const rawAuthor = fileData.frontmatter.author
        let authorText = ""
        if (Array.isArray(rawAuthor)) {
          const authors = rawAuthor.map((a) => String(a).trim()).filter(Boolean)
          if (authors.length === 1) {
            authorText = authors[0]
          } else if (authors.length === 2) {
            authorText = `${authors[0]} and ${authors[1]}`
          } else if (authors.length > 2) {
            authorText = `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`
          }
        } else if (typeof rawAuthor === "string") {
          authorText = rawAuthor.trim()
        }

        if (authorText) {
          const i18nAuthor = i18n(cfg.locale).components.contentMeta.author
          const displayedAuthor = i18nAuthor
            ? i18nAuthor({ author: authorText })
            : `By ${authorText}`
          segments.push(<span>{displayedAuthor}</span>)
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
