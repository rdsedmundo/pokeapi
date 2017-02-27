# pokeapi

> A simple game that consumes pokeapi.co API.

## Build Setup

It's very recommended to use `yarn` package manager over `npm`, however, all the commands below have the same behavior, executing with `yarn` or `npm`.

``` bash
# install dependencies
yarn # npm install

# serve with hot reload at localhost:8080
yarn run dev # npm run dev

# build for production with minification
yarn run build # npm run build

# execute linter in all files
yarn run lint # npm run lint

# execute tests and generate coverage
yarn test # npm test

# execute tests and re-execute on file changes
yarn run test-dev # npm run test-dev
```

## Implementation Details

All Javascript codes follow the Airbnb's Styleguide. There's rules inside `eslint` to make sure that the all the statements will be fine with the styleguide.

The all modules are bundled using Webpack. It includes not even `.js` files, but all `.vue` components, `css` files and all images/assets too.

Since the API has an rate limit of requests per IP daily, all payloads will be cached after the first time it gets requested, and will expire only after 24 hours. There's an abstraction of this cache, currently using local storage for saving the data.

## Game

For play, simple add Pokemons by start typing his names, and clicking on the auto complete field, or by pressing enter. For attack an enemy, you should select an pokemon that will perform the attack, choose which move it will use, then drag-and-drop to the enemy you want to attack.
