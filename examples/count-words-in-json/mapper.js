#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateJsonLines = streamingUtils.iterateJsonLines;
var emit = streamingUtils.emit;

iterateJsonLines(function(tweet) {
    var words = tweet.text.split(/\s+/);

    words.forEach(function(word) {
        word = word.toLowerCase().replace(/\W/, '');
        emit(word, 1);
    });
});