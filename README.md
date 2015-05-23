[![Build Status](https://travis-ci.org/koorchik/node-hadoop-streaming-utils.svg?branch=master)](https://travis-ci.org/koorchik/node-hadoop-streaming-utils)

Hadoop streaming utils for NodeJS
---------------------------------

This is not a framework. This is just set of utils to allow writing hadoop jobs easly.


### SYNOPSYS
```
// mapper.js (count word example)

var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateJsonLines(function(line) {
    var words = line.split(/\s+/);

    words.forEach(function(word) {
        hadoopUtils.emit(word, 1);
    });
});

// reducer.js

var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateKeysWithGroupedJsonValues(function(word, counts) {
    var totalCount = 0;
    counts.forEach(function(cnt) {
        totalCount += cnt;
    });

    emit(word, totalCount);
});

// Run (emulate hadoop-streaming behaviour) 
cat file | node mapper.js | sort -k1,1 | node reducer.js
```

### FUNCTIONS WORKING WITH JSON

#### iterateJsonLines
Will read input line by line and will apply JSON.parse to every line.

```
hadoopUtils.iterateJsonLines(function(data) {

});
```

#### iterateKeysWithJsonValues
1) Reads input line by line. 
2) Extract key and value from line. 
3) Apply JSON.parse to value.

```
hadoopUtils.iterateKeysWithJsonValues(function(key, value) {

});
```


#### iterateKeysWithGroupedJsonValues
1) Reads input line by line. 
2) Extract key and value from line. 
3) Apply JSON.parse to value.
4) Groups all values by key.

```
hadoopUtils.iterateKeysWithGroupedJsonValues(function(key, values) {

});
```

* emit

### FUNCTIONS WORKING WITH RAW DATA

* iterateLines
* iterateKeysWithValues
* iterateKeysGroupedValues
* emit
* incrementCounter


### ASYNC OPERATIONS


