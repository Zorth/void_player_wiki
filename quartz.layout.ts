import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
    head: Component.Head(),
    header: [],
    afterBody: [],
    footer: Component.Footer({
        links: {
            "Foundry": "http://vtt.tarragon.be/join",
            "Discord": "https://discord.gg/TarragonVZW",
        },
    }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
    beforeBody: [
        Component.ConditionalRender({
            component: Component.Breadcrumbs(),
            condition: (page) => page.fileData.slug !== "index",
        }),
        Component.ArticleTitle(),
        Component.ContentMeta(),
        // Component.TagList(),
    ],
    left: [
        Component.PageTitle(),
        Component.MobileOnly(Component.Spacer()),
        Component.Flex({
            components: [
                {
                    Component: Component.Search(),
                    grow: true,
                },
                { Component: Component.Darkmode() },
                { Component: Component.ReaderMode() },
            ],
        }),
        Component.Explorer(),
    ],
    right: [
        Component.Graph({
            localGraph: {
                drag: true,
                zoom: true,
                depth: 1,
                scale: 1.1,
                repelForce: 0.5,
                centerForce: 0.3,
                linkDistance: 30,
                fontSize: 0.6,
                opacityScale: 1,
                removeTags: [],
                showTags: false,
                enableRadial: false,
                showUnresolved: true,
                nodeSize: 1.8,
                colors: {
                    "tag:session": "#e05292",
                    "tag:pc/apprentice": "#c2a05b",
                    "tag:event": "#b1e052",
                    "tag:npc": "#52e0b1",
                    "tag:location": "#52b260",
                    "tag:organization": "#5252e0",
                    "tag:world": "#b152e0",
                    "path:tags": "#e052f1",
                    "path:_META": "#050724",
                    "tag:pc/journeyman": "#e0b152",
                    "tag:pc/master": "#ffaa00",
                }
            },
            globalGraph: {
                drag: true,
                zoom: true,
                depth: -1,
                scale: 0.9,
                repelForce: 1.0,
                centerForce: 0.3,
                linkDistance: 184,
                fontSize: 0.6,
                opacityScale: 1,
                removeTags: [],
                showTags: false,
                enableRadial: true,
                showUnresolved: true,
                nodeSize: 1.8,
                colors: {
                    "tag:session": "#e05292",
                    "tag:pc/apprentice": "#c2a05b",
                    "tag:event": "#b1e052",
                    "tag:npc": "#52e0b1",
                    "tag:location": "#52b260",
                    "tag:organization": "#5252e0",
                    "tag:world": "#b152e0",
                    "path:tags": "#e052f1",
                    "path:_META": "#050724",
                    "tag:pc/journeyman": "#e0b152",
                    "tag:pc/master": "#ffaa00",
                }
            },
        }),
        Component.DesktopOnly(Component.TableOfContents()),
        Component.Backlinks(),
        Component.RecentNotes({ title: "Recent notes", limit: 5, showTags: false })
    ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
    beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
    left: [
        Component.PageTitle(),
        Component.MobileOnly(Component.Spacer()),
        Component.Flex({
            components: [
                {
                    Component: Component.Search(),
                    grow: true,
                },
                { Component: Component.Darkmode() },
            ],
        }),
        Component.Explorer(),
    ],
    right: [],
}
