## babel-plugin-rdeco

用于通过 import 自动载入 rdeco module 的 babel 插件

### 快速开始

````js
// babel.config.js

module.exports = {
  plugins:[
    ['rdeco',{
      moduleMap:{
        'foo':'http://cdn.foo.js'
      }
    }]
  ]
}
```js

```js
// foo.js
import { create } fro '@rdeco/core'

create({
  name:'foo',
  exports:{
    name(){
      next('foo')
    }
  }
})
create({
  name:'hello',
  exports:{
    name(){
      next('hello')
    }
  }
})
````

```js
// bar.js
import { foo, hello } from 'foo'
import rdeco from '@rdeco/web-app-sdk'

const res = await foo.name() // 'foo'

↓

import('http://cdn.foo.js')
import rdeco from '@rdeco/web-app-sdk'

const foo = rdeco.inject('foo')
const hello = rdeco.inject('hello')

const res = await foo.name() // 'foo'

```
