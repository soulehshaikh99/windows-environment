# Windows Environment Variable Management Library for JS Lovers

> :rocket: :telescope: A powerful library to manage Environment Variables on Windows using Node.JS for Electron and Node.JS Developers.

<strong>Install</strong>
```
$ npm i windows-environment
```

<strong>Environment Variable Management operations offered by this library:</strong>
1) Read all Environment Variables of the specified target (User and Machine).
2) Read values of a specified Environment Variable.
3) Create a new or append additional values to an already existing Environment Variable.
4) Delete an Environment Variable by specifying its name.
5) Delete a single value from an already existing Environment Variable.
6) Finds broken paths in an Environment Variable (the path which no longer exits on your File System).
7) Find duplicate values in an Environment Variable.
8) Lastly optimize an Environment Variable's value which removes any redundancies (duplicate values) and broken paths.

<strong>Pros:</strong>
1) Although the code is not written completely in Node.JS, still it guarantees speed and efficiency.
2) Library size is only about 200 kb.

<strong>Cons:</strong>
1) It requires .NET Framework 3.5 Client Profile as it is build upon C# Code.

<strong>Read all Environment Variables of the specified target (User and Machine):</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, ExpandedForm } = require('windows-environment');

// Here the return value is an array of objects with name/value pairs.
let returnValues = Env.get({
    //specifies the target i.e. to search for environment variables inside user target
    target: Target.USER,
    //If this is set to no, all the values will be displayed as is.
    //If set to yes then, the values enclosed inside % symbol will take its long form
    //for e.g. %userprofile% will be C:\Users\UserName
    //for e.g. %systemroot% will be C:\Windows
    expandedForm: ExpandedForm.NO
});

//This looks pretty nice, give it a try.
console.table(returnValues);

// As the return value is an array(iterable object) it can be iterated using a for...of loop
for (let iter of returnValues)   {
    //iter is an object having name and value as keys
    console.log('Name : '+iter.name);
    console.log('Value : '+iter.value);
}
```

<strong>Read values of a specified Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, ExpandedForm } = require('windows-environment');

// Here the return value is a string cause the name field is specified.
let pathString = Env.get({
    //specifies the target i.e. to search for environment variables inside machine target
    target: Target.MACHINE,
    //If this is set to no, all the values will be displayed as is.
    //If set to yes then, the values enclosed inside % symbol will take its long form
    //for e.g. %userprofile% will be C:\Users\UserName
    //for e.g. %systemroot% will be C:\Windows
    expandedForm: ExpandedForm.YES,
    //This can be any name from that target like JDK, PATH, GH_TOKEN, TEMP, TMP, etc.
    name: 'PATH'
});

//Outputs the value of 'PATH' environment variable inside Machine target.
console.log(pathString);
```

<strong>Create a new Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, SetOperationType } = require('windows-environment');

// This method needs admin privileges for successful execution.
// Here the return value is the exit code either 0 for success or 1 for failure.
let exitCode = Env.set({
    //specifies the target, where to create the Environment Variable.
    target: Target.USER,
    //forcefully creates a new environment variable.
    //if an environment variable already exists with the same name
    //it simply overwrites it.
    setOperationType: SetOperationType.NEW,
    //the name of Environment Variable you want to create.
    name: 'PATH',
    //the value you want to give it.
    //Note: semicolons (;) are used for separating two paths if you have only single value then no need to use semicolons.
    value: 'F:\\Git\\PortableGit;C:\\Users\\Souleh\\AppData\\Roaming\\npm;C:\\Program Files (x86)\\Yarn\\bin'
});

//Use this line of code to know if operation was successful or not.
console.log((exitCode === 0) ? 'Operation was successful' : 'Operation failed!!!');
```

<strong>Append values to an already existing Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, SetOperationType } = require('windows-environment');

// This method needs admin privileges for successful execution.
// Here the return value is the exit code either 0 for success or 1 for failure.
let exitCode = Env.set({
    //specifies the target, where to create the Environment Variable.
    target: Target.MACHINE,
    //forcefully creates a new environment variable.
    //if an environment variable already exists with the same name
    //it simply overwrites it.
    setOperationType: SetOperationType.APPEND,
    //the name of Environment Variable you want to modify.
    name: 'PATH',
    //the value you want to give it.
    //Note: semicolons (;) are used for separating two paths if you have only single value then no need to use semicolons.
    value: 'C:\\Program Files\\Java\\jdk1.8.0_202\\bin'
});

//Use this line of code to know if operation was successful or not.
console.log((exitCode === 0) ? 'Operation was successful' : 'Operation failed!!!');
```

<strong>Delete an Environment Variable by its name:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target } = require('windows-environment');

// This method needs admin privileges for successful execution.
// Here the return value is the exit code either 0 for success or 1 for failure.
let exitCode = Env.del({
    //specifies the target, form where to delete the Environment Variable.
    target: Target.MACHINE,
    //the name of Environment Variable you want to delete.
    name: 'JAVA_HOME',
});

//Use this line of code to know if operation was successful or not.
console.log((exitCode === 0) ? 'Operation was successful' : 'Operation failed!!!');
```

<strong>Delete a single value from an already existing Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target } = require('windows-environment');

// This method needs admin privileges for successful execution.
// Here the return value is the exit code either 0 for success or 1 for failure.
let exitCode = Env.del({
    //specifies the target, form where to delete the Environment Variable.
    target: Target.USER,
    //the name of Environment Variable's value you want to delete.
    name: 'PATH',
    //Note the value is case-sensitive,
    //if no matching value is found in the specified Environment Variable's value nothing will be deleted.
    value:'F:\\Git\\PortableGit'
});

//Use this line of code to know if operation was successful or not.
console.log((exitCode === 0) ? 'Operation was successful' : 'Operation failed!!!');
```

<strong>Finds broken paths in an Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, ExtOperationType } = require('windows-environment');

// Here the return value is an array of strings
let returnValues = Env.ext({
    //specifies the target i.e. to search for environment variables inside user target
    target: Target.USER,
    //finds all broken paths
    extOperationType: ExtOperationType.BROKEN,
    //name of the Environment Variable to find broken paths (the path which no longer exits on your File System).
    name: 'MAVEN_HOME'
});

// As the return value is an array(iterable object) it can be iterated using a for...of loop
for(let iter of returnValues)   {
    console.log(iter);
}
```

<strong>Find duplicate values in an Environment Variable:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, ExtOperationType } = require('windows-environment');

// Here the return value is an array of strings
let returnValues = Env.ext({
    //specifies the target i.e. to search for environment variables inside machine target
    target: Target.MACHINE,
    //finds all duplicates
    extOperationType: ExtOperationType.DUPLICATES,
    //name of the Environment Variable to finds duplicates values in.
    name: 'PATH'
});

// As the return value is an array(iterable object) it can be iterated using a for...of loop
for(let iter of returnValues)   {
    console.log(iter);
}
```

<strong>Optimize an Environment Variable's value:</strong>
```javascript
// ES6 Destructuring Assignment
const { Env, Target, ExtOperationType } = require('windows-environment');

// Here the return value is a string
let optimizedPath = Env.ext({
    //specifies the target i.e. to search for environment variables inside user target
    target: Target.USER,
    //returns an optimized string removing any duplicates and broken paths
    extOperationType: ExtOperationType.OPTIMIZE,
    //name of the Environment Variable to optimize.
    name: 'PATH'
});

console.log(optimizedPath);
```

<h3>Made with :heart: from Souleh</h3>

<h3>:clipboard: License: </h3>
Licensed under the <a href="https://github.com/soulehshaikh99/windows-environment/blob/master/LICENSE">MIT License</a>.
