#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedJsonValues = streamingUtils.iterateKeysWithGroupedJsonValues;
var emit = streamingUtils.emit;

iterateKeysWithGroupedJsonValues(function(word, counts) {
    var totalCount = 0;
    counts.forEach(function(cnt) {
        totalCount += cnt;
    });

    emit(word, totalCount);
});