#!/usr/bin/env node
import shelljs from 'shelljs'
const cwd = process.cwd();
const basePackagesPath = path.resolve(cwd, 'packages/');
const packages = fs.readdirSync(basePackagesPath);
try {
  shelljs.exec('cd ./packages')
  packages.forEach(name => {
    console.log('publish ' + name);
    shelljs.exec('cd ../' + name + ' && yarn publish --access public --registry https://registry.npmjs.org/')
    console.log('publish ' + name + ' success');
  })
  console.log('publish success');
} catch (error) {
  throw error
}
