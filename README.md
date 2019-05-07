# openlayers-react-example

Demonstion application to show how React, Redux, and OpenLayers
work together.

Setup

cd to a directory where the project will exist locally

```
git clone https://github.com/glennvorhes/openlayers-react-example.git
```

Open the project in your IDE and run the following.  Alternatively, cd
to the project directory to run.

```
npm install
```

package.json has one named script that can be run with

```
npm run serve
```

which is shorthand for the script declaration

```
parcel serve index.html
```

This will bundle all the referenced files in index.html and start a 
development server.  As changes to your files are made, the browser
will reload automatically.

If using a JetBrains IDE and I recommend that you do, search for 'Safe Write'
in the IDE settings and uncheck the box.  With safe write enabled, the IDE writes
to a temporary file and the parcel file watcher won't work as expected.  



React and Redux are separate frameworks for application rendering and 
maintenance of application state respectively.  React-Redux is the package
that can be used to bind application state (referred to as the store) to 
application rendering.  Properties of the store are mapped to React component
properties.  The React components are dynamically re-rendered as changes 
are made to the application store. 

The OpenLayers component is not really integrated into React but code
to do tasks such as creating the map or adding layers can be contained
within React Component classes for organizational purposes.

In this example, I make extensive use or the JavaScript function fat
arrow syntax.  The following are functionally equivalent.

```javascript

function addOne(aNumber){
    return aNumber + 1;
}

let addTwo = function (aNumber) {
    return aNumber + 2
};

let addThree = (aNumber) => {
    return aNumber + 3
};
````

The fat arrow syntax has the benefit of maintaining function context for 
use of the "this" keyword.  In short, what "this" refers to is really confusing
when using the "function" syntax; especially so within the context of a 
JavaScript ES6 class declaration.  I would recommend using the fat arrow syntax.

You'll notice that I am using TypeScript.  I had planned to have your 
development in JavaScript but see benefits to TypeScript.  I use it and see
that it is increasingly being used as the source code for common libraries.
There is a planned transition for OpenLayers to be TypeScript native and even
some of the ESRI JavaScript API source uses TypeScript.

The Parcel bundler makes it very easy.  The only requirement is a configuration
file (tsconfig.json) at the root of the directory.  This only needs to be done 
once and is included in this project.     

The only additional work to take full benefit of TypeScript is to include
the type definitions in your functions.  For example:

JavaScript
```javascript
let addThree = (aNumber) => {
    return aNumber + 3
};
```

TypeScript
```typescript
let addThree = (aNumber: number) : {theNumber: number, someText: string} => {
    return {theNumber: aNumber + 3, someText: 'here is text'}
};
```

Your IDE will know that the function takes one number parameter and an object 
with 'theNumber' as a number and 'someText' as a string.  

Creating code in this way lets you know about type inconsistencies
in the IDE and reduces debugging work during runtime.



