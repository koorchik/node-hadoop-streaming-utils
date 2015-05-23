'use strict';

var exec    = require('child_process').exec;
var fs      = require('fs');
var Promise = require('bluebird');
var assert  = require('chai').assert;

test('Test examples count-words-in-text',  function(done) {
    testExample('count-words-in-text').then(function() {
        done();
    });
});

test('Test examples count-words-in-text-async',  function(done) {
    testExample('count-words-in-text-async').then(function() {
        done();
    });
});

test('Test examples count-words-in-json',  function(done) {
    testExample('count-words-in-json').then(function() {
        done();
    });
});

test('Test examples build-inverted-index',  function(done) {
    testExample('build-inverted-index').then(function() {
        done();
    });
});

function testExample(example) {
    var exampleFolder = __dirname + '/../examples/' + example;

    var mapper   = exampleFolder + '/mapper.js';
    var reducer  = exampleFolder + '/reducer.js';
    var input    = exampleFolder + '/data/input';
    var expected = exampleFolder + '/data/expected';

    var cmd = 'cat ' + input + ' | ' + mapper + ' | sort -k1,1 | ' + reducer;

    return Promise.all([ execAsync(cmd), readFileAsync(expected) ]).then(function(res) {
        var got = res[0];
        var expected = res[1];

        assert.equal(got, expected, 'Checking example ' + example);
    }).catch(function(err) {
        throw err;
    });
}


function execAsync(cmd) {
    return new Promise( function(resolve, reject) {
         exec(cmd, function(err, stdout) {
            if (err) reject(err);
            resolve(stdout);
        });
    });
}

function readFileAsync(file) {
    return new Promise( function(resolve, reject) {
         fs.readFile(file, function(err, data) {
            if (err) reject(err);
            resolve(data.toString());
        });
    });
}