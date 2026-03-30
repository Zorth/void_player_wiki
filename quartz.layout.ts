import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
    head: Component.Head(),
    header: [],
    afterBody: [
        Component.Backlinks(),
    ],
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
        Component.Explorer({
            sortFn: (a, b) => {
                if (a.isFolder && !b.isFolder) return -1
                if (!a.isFolder && b.isFolder) return 1
                if (a.isFolder && b.isFolder) {
                    return a.displayName.localeCompare(b.displayName, undefined, {
                        numeric: true,
                        sensitivity: "base",
                    })
                }
                const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
                const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
                if (dateA.getTime() !== dateB.getTime()) return dateB.getTime() - dateA.getTime()
                return a.displayName.localeCompare(b.displayName, undefined, {
                    numeric: true,
                    sensitivity: "base",
                })
            },
        }),
    ],
    right: [
        Component.Graph({
            localGraph: {
                drag: true, // whether to allow panning the view around
                zoom: true, // whether to allow zooming in and out
                depth: 1, // how many hops of notes to display
                scale: 0.5, // default view scale
                repelForce: 10, // how much nodes should repel each other
                centerForce: 0.33, // how much force to use when trying to center the nodes
                linkDistance: 184, // how long should the links be by default?
                fontSize: 0.6, // what size should the node labels be?
                opacityScale: 1, // how quickly do we fade out the labels when zooming out?
                removeTags: [], // what tags to remove from the graph
                showTags: true, // whether to show tags in the graph
                enableRadial: false, // whether to constrain the graph, similar to Obsidian
                nodeSizeMultiplier: 1.81,
                excludePath: ["_META"],
                colorGroups: [
                    { query: "tag:#session", color: "#E05252" },
                    { query: "tag:#pc/apprentice", color: "#C2A05B" },
                    { query: "tag:#event", color: "#B1E052" },
                    { query: "", color: "#52E052" },
                    { query: "tag:#npc", color: "#52E0B1" },
                    { query: "tag:#location", color: "#52B1E0" },
                    { query: "tag:#organization", color: "#5252E0" },
                    { query: "tag:#world", color: "#B152E0" },
                    { query: "path:tags", color: "#E052B1" },
                    { query: "path:_META", color: "#050724" },
                    { query: "tag:#pc/journeyman", color: "#E0B152" },
                    { query: "tag:#pc/master", color: "#FFAA00" },
                ]
            },
            globalGraph: {
                drag: true,
                zoom: true,
                depth: -1,
                scale: 0.3,
                repelForce: 10,
                centerForce: 0.33,
                linkDistance: 184,
                fontSize: 0.6,
                opacityScale: 1,
                removeTags: [], // what tags to remove from the graph
                showTags: false, // whether to show tags in the graph
                enableRadial: true, // whether to constrain the graph, similar to Obsidian
                nodeSizeMultiplier: 1.81,
                excludePath: ["_META"],
                colorGroups: [
                    { query: "tag:#session", color: "#E05252" },
                    { query: "tag:#pc/apprentice", color: "#C2A05B" },
                    { query: "tag:#event", color: "#B1E052" },
                    { query: "", color: "#52E052" },
                    { query: "tag:#npc", color: "#52E0B1" },
                    { query: "tag:#location", color: "#52B1E0" },
                    { query: "tag:#organization", color: "#5252E0" },
                    { query: "tag:#world", color: "#B152E0" },
                    { query: "path:tags", color: "#E052B1" },
                    { query: "path:_META", color: "#050724" },
                    { query: "tag:#pc/journeyman", color: "#E0B152" },
                    { query: "tag:#pc/master", color: "#FFAA00" },
                ]
            },
        }),
        Component.DesktopOnly(Component.TableOfContents()),
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
        Component.Explorer({
            sortFn: (a, b) => {
                if (a.isFolder && !b.isFolder) return -1
                if (!a.isFolder && b.isFolder) return 1
                if (a.isFolder && b.isFolder) {
                    return a.displayName.localeCompare(b.displayName, undefined, {
                        numeric: true,
                        sensitivity: "base",
                    })
                }
                const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
                const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
                if (dateA.getTime() !== dateB.getTime()) return dateB.getTime() - dateA.getTime()
                return a.displayName.localeCompare(b.displayName, undefined, {
                    numeric: true,
                    sensitivity: "base",
                })
            },
        }),
    ],
    right: [],
}
