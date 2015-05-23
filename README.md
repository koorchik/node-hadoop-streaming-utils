[![Build Status](https://travis-ci.org/koorchik/node-hadoop-streaming-utils.svg?branch=master)](https://travis-ci.org/koorchik/node-hadoop-streaming-utils)

Hadoop streaming utils for NodeJS
---------------------------------

A set of functions to allow you write hadoop jobs easily.

### Synopsys
```
// mapper.js (count word example)
var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateJsonLines(function(line) {
    var words = line.split(/\s+/);

    words.forEach(function(word) {
        // using emitJson instead of emit allows to preserve variable type
        hadoopUtils.emitJson(word, 1); 
    });
});

// reducer.js
var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateKeysWithGroupedJsonValues(function(word, counts) {
    var totalCount = 0;
    counts.forEach(function(cnt) {
        // no need to parseInt because in reducer we use "emitJson"
        totalCount += cnt; 
    });

    hadoopUtils.emitJson(word, totalCount);
});

// Run (emulate hadoop-streaming behaviour) 
cat file | node mapper.js | sort -k1,1 | node reducer.js
```

See more examples in "examples" folder.

### Description

This modules contains a set of utils to read and process data line by line. So, next line will be read only after finishing processing the previous one. It is easy when your callback is synchronous. When your callback is asynchronous you should return a promise from it. Moreover, every iterating function returns a promise which will be resolved after finishing processing all lines. 

### Functions working with json data

**iterateJsonLines**

Will read input line by line and will apply JSON.parse to each line.

```
hadoopUtils.iterateJsonLines(function(data) {  });
```

**iterateKeysWithJsonValues**

1. Reads input line by line. 
2. Extracts key and value from line. 
3. Applies JSON.parse to value.

```
hadoopUtils.iterateKeysWithJsonValues(function(key, value) { });
```


**iterateKeysWithGroupedJsonValues**

1. Reads input line by line. 
2. Extracts key and value from line. 
3. Applies JSON.parse to value.
4. Groups all values by key.

```
hadoopUtils.iterateKeysWithGroupedJsonValues(function(key, values) { });
```

**emitJson**

Serializes data to JSON and emits it.

```
hadoopUtils.emitJson(key, data);
```

### Functions working with raw data

**iterateLines**

Will read and process input line by line.

```
hadoopUtils.iterateLines(function(data) {  });
```

**iterateKeysWithValues**

1. Reads input line by line. 
2. Extracts key and value from line. 

```
hadoopUtils.iterateKeysWithValues(function(key, value) { });
```


**iterateKeysWithGroupedValues**

1. Reads input line by line. 
2. Extracts key and value from line. 
3. Groups all values by key.

```
hadoopUtils.iterateKeysWithGroupedValues(function(key, values) { });
```

**emit**

Emits key and value.

```
hadoopUtils.emitJson(key, value);
```

**incrementCounter**

Updates hadoop counter. 

```
hadoopUtils.incrementCounter(group, counter, amount);
```


### Async operations
When your callback is async you should return promise from it. So, iterating function will wait until promise is resolved. Moreover, every iterating function returns a promise which will be resolved when all lines were processed. 

**Usage example**

```
var Promise = require('bluebird');

var streamingUtils = require('hadoop-streaming-utils');

streamingUtils.iterateLines(function(line) {
    return new Promise(function(resolve, reject) {
        asyncSplit(line, function(err, words) {
            resolve(words);
        });
    }).then(function(words) {
        words.forEach(function(word) {
            streamingUtils.emitJson(word, 1);
        });
    });
}).then(function() {
    process.exit();
}).catch(console.error);

function asyncSplit(line, callback) {
    var words = line.split(/\s+/);
    setTimeout(function() {
        callback(null, words);
    }, 500);
}

```

### Author
koorchik (Viktor Turskyi)


