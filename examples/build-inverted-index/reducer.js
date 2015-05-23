#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateKeysWithGroupedJsonValues = streamingUtils.iterateKeysWithGroupedJsonValues;
var emitJson = streamingUtils.emitJson;

iterateKeysWithGroupedJsonValues(function(word, group) {
    group.sort();
    emitJson(word, group);
});