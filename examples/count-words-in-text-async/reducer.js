#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedJsonValues = streamingUtils.iterateKeysWithGroupedJsonValues;
var emit = streamingUtils.emit;

iterateKeysWithGroupedJsonValues(function(word, group) {
    var count = group.reduce(function(a,b) {return a+b}, 0);

    emit(word, count);
});