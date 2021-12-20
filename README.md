


# vuelpers
Extented vue helpers functions

## Install

```
$ npm install vuelpers
```
or with yarn
```
$ yarn add vuelpers
```

## Functions

##### 1. createMutations
It's a vuex mutations generator which we use commonly to make changes in state like set a state value, push, update, delete a item in an array, reset the whole state. Using this package you don't have to write any mutations to make changes in state it has all the neccessary mutations to update state.

```js
import { createMutations } from 'vuelpers'

const initialState = () => ({
  loading: false,
  counter: 0,
  user: {
    name: null
  }
})

const mutations = {
  ...createMutations('SET')
  // your other mutations
}
```
```js
  commit('SET', { loading: true })
```
```js
  commit('SET', { counter: c => c + 1 })
```
```js
  commit('SET', { 'user.name': 'John Doe' })
```
or in single object
```js
  commit('SET', { 
    loading: true,
    counter: c => c + 1,
    'user.name': 'John Doe'
  })
```

### Mutations Types
There is the list of mutation types

`SET`       - Set or change something to the state.\
`RESET`     - Reset the current state to initial state.\
`PUSH`      - Push items in an array.\
`UNSHIFT`   - Unshift items in an array.\
`UPDATE`    - Replace an array item with specified item.\
`DELETE`    - Delete an array item with specified id or any identifier.

Lets breakdown each of these. Consider this is our store.

```js

import { createMutations } from 'vuelpers'

const initialState = () => ({
  users: {
    page: 1,
    perPage: 20,
    data: [
      {
        id: 1,
        name: 'John doe',
        email: 'john@gmail.com'
      },
      {
        id: 2,
        name: 'David Davis',
        email: null
      }
    ],
  },
  books: [
    {
      id: 1,
      name: 'Book Name'
    }
  ]
})
const mutations = {
  ...createMutations('SET', 'RESET', 'PUSH', 'UNSHIFT', 'UPDATE', 'DELETE')
  // your other mutations
}
```

#### `RESET`
```js
commit('RESET', initialState())
```

#### `PUSH` and  `UNSHIFT`
```js
let newUser = {
  id: 3,
  name: 'Thomas Rivers',
  email: 'thomas@gmail.com'
}

commit('PUSH', ['users.data', newUser])

// or like this
commit('PUSH', {
  'user.data': newUser
})

// or multiple item at once
commit('PUSH', {
  'user.data': [newUser, anotherUser]
})

// or (push or unshift) to multiple array at once
commit('PUSH', {
  'books': newBook,
  'user.data': [newUser, anotherUser],
})
```

#### `UPDATE`

```js
commit('UPDATE', ['users.data', newUser, /* id - optional parameter to match by */])
```


| Methods  | Returns | Descriptions |
| :---- | :---- | :---- |
| `isEmpty(value:any)` | `boolean` | Check if the given value is empty or not
| `miniId(len?: number)` | `string` | Generate a random id of maximum 10 characters length
| `sleep(time?:number, unit?: string)` | `Promise<any>` | Promise to await specific time
