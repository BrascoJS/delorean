![Delorean logo](https://github.com/BrascoJS/delorean/blob/master/assets/deloreanLogo.png)

[![NPM](https://nodei.co/npm/mobx-delorean.png?compact=true)](https://npmjs.org/package/mobx-delorean)


# Delorean
An intuitive, in-app MobX + React developer tool employing time travel debugging and undo/redo actions. Quickly and easily gain insight into MobX-React projects, in just three easy steps.

![Time Travel](https://github.com/BrascoJS/delorean/blob/master/assets/timeTravel.gif "Delorean time travel")

# Features
- Flexible time travel functionality
- Persistent log of every observable action and state change, including individual diffs and complete application state
- Easy undo/redo of actions without unwanted side effects
- Alternate timeline debugging. Reverse your application's state and branch into a new timeline with the option of returning to your original state.

# Installation

### NPM Module
Delorean is easily installed through npm as a developer dependency using your terminal.

```javascript
npm install mobx-delorean --save-dev
```

# Getting Started
Import `DeloreanTools` and `delorean` from the mobx-delorean module.

```javascript
// in top level React component file
import { DeloreanTools } from 'mobx-delorean';

...

  render() {
    return (
      <div>
        <DeloreanTools />
        <YourComponent />
      <div>
    )
  }
```

```javascript
// in MobX store files(s)
import { delorean } from 'mobx-delorean';

...

export default delorean(YourStore, [config]);
```

#### config
  - arguments
    - **name** (*string*): the instance name to be shown in the toolbar
    - **onlyActions** (*boolean*): if true, Delorean will only track actions. Using MobX in strict mode causes a default to true
    - **global** (*boolean*): if true, Delorean will assign dispatching of unhandled actions to this global store
    - **filters** (*object*): whitelist or blacklist certain action types using an array of regular expressions as strings
      - **whitelist** any other actions will be ignored by Delorean
      - **blacklist** Delorean will ignore this action
      
__Note__: Delorean relies on wrapping your MobX store export in order to track its observables and parse its dependency tree at runtime. If you are using multiple stores, you can wrap them separately and Delorean will track them in a singular UI.

Open your MobX app in the browser and notice the Delorean toolbar at the top of your app. In order from left to right:

1) Time Travel Slider - Click to toggle the time travel slider's visibility. Drag and drop the position marker to traverse through the log of previous application states.

2) Undo/Redo Actions - Step forward and back through your application's state one action at a time with specific details about each change.

3) Store Structure Visualizer - Open a new tab with a rich heirarchy visualization of your MobX store's dependency tree. (in development)
