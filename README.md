## structured-react-hook

> [简体中文文档](./README_ZN.md)

Structured React state management framework for the enterprise

Completely native solution based on React Hook

> Online [Demo](https://codesandbox.io/s/gallant-wright-f7csc?file=/package.json) shows a more complex TodoApp

### Install

```
yarn add structured-react-hook
or
npm install structured-react-hook
```

### Get started quickly with a basic example

To write a basic example, click the button, display Loading, invoke the server, remove Loading, and display the result returned by the server

```js
import React from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
    name:'testStore',
    initState:{
        loading: false,
        content: 'No data has been loaded'
    },
    controller:{
        async onButtonClick(){
            this.rc.setLoading(true)
            this.rc.setContent('loading...')
            // 此处请求服务端
            const res = await api.get('api/commit')
            this.rc.setLoading(false)
            this.rc.setContent(res.data.content)
        }
    }
}
const useStore = createStore(storeConfig)
function Example(){
    const store = useStore()
    return(
        <div>
            <p>{store.state.content}</p>
            <button onClick={store.controller.onButtonClick}></button>
        </div>
    )
}

```

### A more complicated scenario

```js
import React from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
    name:'testStore',
    initState:{
        loading: false,
        content: 'No data has been loaded'
    },
    service:{
        async query(){
            const res = await api.get('api/query');
            return res.data
        }
    },
    controller:{
        async onButtonClick(){
            this.rc.setState({
                loading:true,
                content:'loading...'
            })
            // 此处请求服务端
            const data = await this.service.query()
            this.rc.setState({
                loading:false,
                content: data
            })
        }
    }
}
const useStore = createStore(storeConfig)
function Example(){
    const store = useStore()
    return(
        <div>
            <p>{store.state.content}</p>
            <button onClick={store.controller.onButtonClick}></button>
        </div>
    )
}

```

## The core concept

### Strictly one-way data flow

Structured-react-hook follows a strict unidirectional data flow architecture

View → Controller[→ Service →]→ Controller → Control the flow of data from a View, including the following rules


- The View cannot retrieve the Service defined in the Store
- A Controller cannot be called to another Controller, except through a membrane call to a Controller of the same name that needs to be overloaded
- Service cannot call setState to modify the View's state trigger render

> For membrane, see the advanced API section below

### Follow Flux's multi-store design

Different from the single store concept advocated by Redux, the original useReducer is adopted to control the state, which naturally follows the design idea of Flux's multiple stores.

And through a lot of engineering practice, the single store is also a seemingly good but not feasible solution, mainly because of the unknowability of the demand business, and when the business becomes large and complex,

The marginal effect of a single store drops dramatically, and in turn increases maintenance costs.

### Secrets that drive React

Unlike Redux, structured-react-hook does not rely on a driver library like react-redux to connect React and Redux. The secret is that structured-react-hook uses useReducer Hook internally to manage state using the ability of the React native API

### What's StoreConfig

Store is a normal JS object that contains the following properties

```js

const storeConfig = {
    name: ", // Must be used to distinguish store uniqueness
    initState :{} // Must select the first argument of the useReducer
    initState:[
        {}, () = > {}
    ] // InitState enhancement mode, the first parameter of the array is still initState, the second parameter is useReducer init function, used to delay the calculation of initState
    ref :{} // An object, structured-react-hook is traversed using useRef HOOK to generate the corresponding ref
    view :{} // To manage dynamic JSX, you can write render functions
    service :{} // Extracted Controller logic, which you may need when controllers become more complex
    controller :{} // The controller of the store, which controls the execution of logic and the setting of UI state, must be named with an ON + a noun + a verb
}
```
### Store Context

structured-react-hook The Store context provides the orientation state and the ability to call each other within the Store. The context is mounted on this, and you can call it from both view controllers and services. The context includes

- rc
- view
- service
- controller
- state
- refs
- name
- context(Context shared by all stores, a global store)
- super(with membrane)
- props(with membrane)

### Controls React State secrets through RC

You might be wondering, with structured-react-hook used internally as useReducer, why is there no Dispatch or Action available and why is there no need to write a Reducer? The secret is that structured-react-hook operations are automatically generated when you declare an initState and are mounted to the Store context this.rc (RC is short for reducer case), so you don't have to write a reducer action type or a reducer case like a redux



### Scenario example

#### Use rc to drive the React function component

```js
import React from 'react';
import createStore from 'structured-react-hook';

const storeConfig = {
    name:'calc',
    initState:{
        count:0
    },
    controller:{
        onAddButtonClick(){
            this.rc.setCount(this.state.count++)
        },
        onSubButtonClick(){
            this.rc.setCount(this.state.count--)
        }
    }
}

const useStore = createStore(storeConfig)

function App(){
    const store = useStore()

    return (
        <div>{store.state.count}</div>
        <button onClick={store.controller.onAddButtonClick}>+ 1</button>
        <button onClick={store.controller.onSubButtonClick}>- 1</button>
    )
}

```

#### Use this.rc.setState to bulk modify the state

```js
import React from 'react';
import createStore from 'structured-react-hook';

const storeConfig = {
    name:'calc',
    initState:{
        count:0,
        count1:1,
        count2:2,
    },
    controller:{
        onAddButtonClick(){
            this.rc.setState({
                count:this.state.count++,
                count1:this.state.count1++,
                count2:this.state.count2++,
            })
        },
        onSubButtonClick(){
            this.rc.setState({
                count:this.state.count--,
                count1:this.state.count1--,
                count2:this.state.count2--
            })
        }
    }
}

const useStore = createStore(storeConfig)

function App(){
    const store = useStore()

    return (
        <div>{store.state.count}</div>
        <div>{store.state.count1}</div>
        <div>{store.state.count2}</div>
        <button onClick={store.controller.onAddButtonClick}>+ 1</button>
        <button onClick={store.controller.onSubButtonClick}>- 1</button>
    )
}

```

#### Replace this in ClassComponent with ref to implement some non-UI consumption state declarations

When you have some values in storeConfig that need to be saved, but don't need to be speared into the UI, consider using ref

> For more scenario-based examples, see the test cases in the test cases directory

## Membrane mode

Membrane mode is a weapon we extract in the context of enterprise-level application development to extend the life cycle of your code. Simply put, it can protect the most important parts of your code

Let's use a real-world scenario to understand membrane

One of the problems we often encounter in development is that we approach business processes differently for different channels, but over time, that difference eats away at us
Reusable code.

For example,

```js

function main(){
    if(channel === 'h5'){
        // todo sth
    }
    todo sth
}

function sub(){
    if(channel === 'h5'){
        // todo sth
    }
    todo sth
}

```

This branch of logic is abundant in real software engineering, and when we need to quickly reuse the logic in main and sub functions, we need to refactor, but the real world scenario is much more complex than this.
We often don't have enough time to refactor, so we're left with...

```js

function main(){
    if(channel === 'h5'){
        // todo sth
        if(platform === 'xxx'){
            ....
        }
    }
    todo sth
}

function sub(){
    if(channel === 'h5'){
        // todo sth
    }
    todo sth
}

```

There may be many ways to solve IF, but so far none of them are effective at unifying this branch logic, and even if you refactor it diligently, it will still end up scattered throughout the whole project
To solve this problem, we create membrane, a kind of pluggable branch logic of the normalized mode

```js
// This code is used to explain what is membrane. It has been simplified for this purpose. The actual use will be slightly different
const storeConfig = {
    main(){
        //todo sth
    },
    sub(){
        // todo sth
    }
    membrane:{
        main(){
            if(channel === 'h5'){
                // todo sth
                if(platform === 'xx'){
                    // todo sth
                }
            }
            this.super.main()
        }
        sub(){
            if(channel === 'h5'){
                // todo sth
            }
            // todo sth
        }

    }
}

```

If we want to explain the design behind membrane, we may need to take up a lot of space. For this part, please refer to the content in the follow-up docs. Here, I will make a brief summary
The inspiration of membrane comes from the biological structure of cell membrane, and meanwhile draws on the design of hook pluggable and object-oriented inheritance and function overload. Here's a real use case

```js
import React from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
    initState:{
        name: jacky
    },
    controller:{
        onButtonClick(){
            this.rc.setName('jacky in main')
        }
    },
    membrane:{
        controller:{
            onButtonClick(){
                if(this.props.platform === 'h5'){
                    this.rc.setName('jacky in h5)
                }
            }
        }
    }
}

const useStore = createStore(storeConfig)

function App(){
    const store = useStore('h5')
    return(
        <div>{this.state.name}</div> // jacky in h5
    )
}

function App(){
    const store = useStore()
    return(
        <div>{this.state.name}</div> // jacky in main
    )
}

```

If you want to reuse this storeConfig, all you have to do is exclude the membrane, and that's the pluggable membrane.


