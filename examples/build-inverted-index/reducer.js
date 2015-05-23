#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedJsonValues = streamingUtils.iterateKeysWithGroupedJsonValues;
var emit = streamingUtils.emit;

iterateKeysWithGroupedJsonValues(function(word, group) {
    group.sort();
    emit(word, group);
});