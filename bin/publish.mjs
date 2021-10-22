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
  if (shelljs.exec('yarn clean && yarn build').code !== 0) {
    shell.echo('Error: Babel Build Faild');
    shell.exit(1);
  }
  shelljs.exec('yarn publish --registry https://registry.npmjs.org/')
  shelljs.exec('yarn publish')
  shelljs.exec('git add .')
  shelljs.exec(`git commit -a -m"chore(version): v${nextVersion}"`)
  shelljs.exec(`git tag v${nextVersion}`)
  shelljs.exec('git push')
  // shelljs.exec('git push --tags && cd ../mencius && yarn pub')
} catch (error) {
  throw error
}
