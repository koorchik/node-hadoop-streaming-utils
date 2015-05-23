Hadoop streaming utils for NodeJS
---------------------------------

This is not a framework. This is just set of utils to allow writing hadoop jobs easly.


### SYNOPSYS
```
var hadoopUtils = require('hadoop-streaming-utils');

hadoopUtils.iterateJsonLines(function(data) {
    hadoopUtils.emit();
});

```

### FUNCTIONS WORKING WITH JSON

* iterateJsonLines
* iterateKeysWithJsonValues
* iterateKeysWithGroupedJsonValues
* emit

### FUNCTIONS WORKING WITH RAW DATA

* iterateLines
* iterateKeysWithValues
* iterateKeysGroupedValues
* emit



