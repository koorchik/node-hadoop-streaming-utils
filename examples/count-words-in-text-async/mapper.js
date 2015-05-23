#!/usr/bin/env node
'use strict;';

var Promise = require('bluebird');

var streamingUtils = require('../../lib/hadoop-streaming-utils');
var iterateLines = streamingUtils.iterateLines;
var emitJson = streamingUtils.emitJson;

iterateLines(function(line) {
    return new Promise(function(resolve, reject) {
        asyncSplit(line, function(err, words) {
            resolve(words);
        });
    }).then(function(words) {
        words.forEach(function(word) {
            emitJson(word, 1);
        });
    });
}).then(function() {
    process.exit();
}).catch(console.error);

function asyncSplit(line, onReady) {
    var words = line.split(/\s+/);
    setTimeout(function() {
        onReady(null, words);
    }, 500);
}
