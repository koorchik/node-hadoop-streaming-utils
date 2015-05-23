#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedValues = streamingUtils.iterateKeysWithGroupedValues;
var emit = streamingUtils.emit;

iterateKeysWithGroupedValues(function(word, counts) {
    var totalCount = 0;
    counts.forEach(function(cnt) {
        totalCount += parseInt(cnt, 10);
    });

    emit(word, totalCount);
});