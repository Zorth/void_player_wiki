import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/timeline.inline"
import style from "./styles/timeline.scss"

const Timeline: QuartzComponent = (_props: QuartzComponentProps) => {
  return <></>
}

Timeline.afterDOMLoaded = script
Timeline.css = style

export default (() => Timeline) satisfies QuartzComponentConstructor
