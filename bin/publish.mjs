#!/usr/bin/env node
import { writeFile, readFile } from 'fs/promises'
import { Buffer } from 'buffer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import shelljs from 'shelljs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDirname = join(__dirname, '..')
const npmrcPath = join(rootDirname, '.npmrc')
const packagejsonPath = join(rootDirname, 'package.json')

try {
  const data = await readFile(packagejsonPath)
  const packagejsonObject = JSON.parse(data.toString())
  const versionMeta = packagejsonObject.version.split('.')
  const major = versionMeta[0]
  const minor = versionMeta[1]
  const patch = versionMeta[2]
  const nextPatch = Number(patch) + 1
  const nextVersion = [major, minor, nextPatch].join('.')
  packagejsonObject.version = nextVersion
  const newPackagejsonObjectData = new Uint8Array(
    Buffer.from(JSON.stringify(packagejsonObject, null, 2))
  )
  await writeFile(packagejsonPath, newPackagejsonObjectData)

  shelljs.exec('yarn publish --registry https://registry.npmjs.org/')
  shelljs.exec('yarn publish')
  shelljs.exec('git push')
  shelljs.exec('git push --tags')
} catch (error) {
  throw error
}
