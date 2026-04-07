import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/leaflet.inline"

const Leaflet: QuartzComponent = (_props: QuartzComponentProps) => {
  return <></>
}

Leaflet.afterDOMLoaded = script

export default (() => Leaflet) satisfies QuartzComponentConstructor
