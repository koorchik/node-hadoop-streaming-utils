#!/usr/bin/env node
'use strict;';

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateJsonLines = streamingUtils.iterateJsonLines;
var emitJson = streamingUtils.emitJson;

iterateJsonLines(function(tweet) {
    var words = tweet.text.split(/\s+/);

    var seenWords = {};
    words.forEach(function(word) {
        word = word.toLowerCase().replace(/\W/, '');

        if (seenWords[word]) return;

        seenWords[word] = true;
        emitJson(word, tweet.id);
    });
});
