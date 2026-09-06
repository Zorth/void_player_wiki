import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

async function getFiles(dir) {
  const subdirs = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir.name)
      return subdir.isDirectory() ? getFiles(res) : res
    })
  )
  return files.flat()
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return

  const stat = await fs.promises.stat(filePath)
  const initialSizeMb = stat.size / (1024 * 1024)

  // Only process images > 300KB
  if (stat.size < 300 * 1024) return

  const tmpPath = filePath + '.tmp'

  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()

    // Resize if max dimension is unreasonably huge (> 2500px)
    let pipeline = sharp(filePath)
    if (metadata.width > 2500 || metadata.height > 2500) {
      pipeline = pipeline.resize({
        width: metadata.width > metadata.height ? 2500 : undefined,
        height: metadata.height >= metadata.width ? 2500 : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    if (ext === '.png') {
      await pipeline
        .png({ compressionLevel: 9, quality: 80, palette: true })
        .toFile(tmpPath)
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(tmpPath)
    }

    const tmpStat = await fs.promises.stat(tmpPath)
    if (tmpStat.size < stat.size) {
      await fs.promises.rename(tmpPath, filePath)
      const finalSizeMb = tmpStat.size / (1024 * 1024)
      console.log(`[Compressed] ${path.basename(filePath)}: ${initialSizeMb.toFixed(2)}MB -> ${finalSizeMb.toFixed(2)}MB`)
    } else {
      await fs.promises.unlink(tmpPath)
      console.log(`[Skipped] ${path.basename(filePath)}: Compressed size was not smaller`)
    }
  } catch (err) {
    if (fs.existsSync(tmpPath)) await fs.promises.unlink(tmpPath)
    console.error(`[Error] Failed to compress ${filePath}:`, err.message)
  }
}

async function run() {
  const contentDir = path.resolve('content')
  console.log('Scanning content directory for images...')
  const files = await getFiles(contentDir)
  for (const file of files) {
    await compressImage(file)
  }
  console.log('Done image compression!')
}

run()
