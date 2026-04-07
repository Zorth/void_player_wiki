import { ConvexHttpClient } from "convex/browser"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

// Configuration
const CONVEX_URL = process.env.CONVEX_URL || "https://silent-heron-111.eu-west-1.convex.cloud"
const CHARACTERS_DIR = "content/Player Characters"

if (!process.env.CONVEX_URL) {
  console.log("⚠️  No CONVEX_URL env var found. Falling back to development database.")
}

async function sync() {
  console.log("🔗 Connecting to Convex...")
  const client = new ConvexHttpClient(CONVEX_URL)

  try {
    // We use the public query we found in void-guild
    // Note: The 'api' object isn't available in pure node without the generated files,
    // so we call the query by its string name.
    const characters = await client.query("characters:listAllCharactersPublic")
    
    if (!characters) {
      console.error("❌ No characters found or query failed.")
      return
    }

    console.log(`✅ Fetched ${characters.length} characters from Guild app.`)

    const files = fs.readdirSync(CHARACTERS_DIR).filter(f => f.endsWith(".md"))

    let updatedCount = 0
    for (const file of files) {
      const filePath = path.join(CHARACTERS_DIR, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const { data, content: body } = matter(content)

      // Match by name (case-insensitive) or explicit name in frontmatter
      const charName = data.title || path.basename(file, ".md")
      const dbChar = characters.find(c => c.name.toLowerCase() === charName.toLowerCase())

      if (dbChar) {
        console.log(`🆙 Updating ${charName}...`)
        
        // Update frontmatter
        data.lvl = dbChar.lvl
        data.xp = dbChar.xp
        data.ancestry = dbChar.ancestry
        data.class = dbChar.class
        data.rank = dbChar.rank
        data.system = dbChar.system

        const newContent = matter.stringify(body, data)
        fs.writeFileSync(filePath, newContent)
        updatedCount++
      } else {
        console.log(`⚠️  No match for ${charName} in database.`)
      }
    }

    console.log(`\n🎉 Done! Updated ${updatedCount} out of ${files.length} character files.`)
  } catch (error) {
    console.error("❌ Sync failed:", error)
  }
}

sync()
