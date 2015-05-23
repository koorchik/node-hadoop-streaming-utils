#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedJsonValues = streamingUtils.iterateKeysWithGroupedJsonValues;
var emitJson = streamingUtils.emitJson;

iterateKeysWithGroupedJsonValues(function(word, group) {
    var count = group.reduce(function(a,b) {return a+b}, 0);

    emitJson(word, count);
});