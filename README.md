[![Build Status](https://travis-ci.org/koorchik/node-hadoop-streaming-utils.svg?branch=master)](https://travis-ci.org/koorchik/node-hadoop-streaming-utils)

Hadoop streaming utils for NodeJS
---------------------------------

This is not a framework. This is just a set of utils to allow you writing hadoop jobs easily.

### SYNOPSYS
```
// mapper.js (count word example)
var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateJsonLines(function(line) {
    var words = line.split(/\s+/);

    words.forEach(function(word) {
        hadoopUtils.emitJson(word, 1); // using emitJson instead of emit allows to preserve variable type
    });
});

// reducer.js
var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateKeysWithGroupedJsonValues(function(word, counts) {
    var totalCount = 0;
    counts.forEach(function(cnt) {
        totalCount += cnt; // no need to parseInt because in reducer we use "emitJson"
    });

    emitJson(word, totalCount);
});

// Run (emulate hadoop-streaming behaviour) 
cat file | node mapper.js | sort -k1,1 | node reducer.js
```

### FUNCTIONS WORKING WITH JSON

#### iterateJsonLines
Will read input line by line and will apply JSON.parse to every line.

```
hadoopUtils.iterateJsonLines(function(data) {
    // process data here
});
```

#### iterateKeysWithJsonValues
1. Reads input line by line. 
2. Extracts key and value from line. 
3. Applies JSON.parse to value.

```
hadoopUtils.iterateKeysWithJsonValues(function(key, value) {
    // process data here
});
```


#### iterateKeysWithGroupedJsonValues
1. Reads input line by line. 
2. Extracts key and value from line. 
3. Applies JSON.parse to value.
4. Groups all values by key.

```
hadoopUtils.iterateKeysWithGroupedJsonValues(function(key, values) {
    // process data here
});
```

#### emitJson
Serializes data to JSON and emits it

```
hadoopUtils.emitJson(key, data);
```

### FUNCTIONS WORKING WITH RAW DATA

* iterateLines
* iterateKeysWithValues
* iterateKeysGroupedValues
* emit
* incrementCounter

### ASYNC OPERATIONS


