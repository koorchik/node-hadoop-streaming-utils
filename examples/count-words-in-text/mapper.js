#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateLines = streamingUtils.iterateLines;
var emit = streamingUtils.emit;

iterateLines(function(line) {
    var words = line.split(/\s+/);

    words.forEach(function(word) {
        emit(word, 1);
    });
});