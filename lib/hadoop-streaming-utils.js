'use strict';

var Promise = require('bluebird');
var split = require('split');

module.exports = {
    iterateJsonLines: function(cb) {
        return this.iterateLines(function(line) {
            try {
                var data = JSON.parse(line);
                return cb(data);
            } catch(e) {
                process.stderr.write('Error Processing Line ' + line + ' ERROR:' + e + '\n');
            }
        });
    },

    iterateLinesWithJsonValues: function(cb) {
        return this.iterateLines(function(line) {
            var parts = line.split(/\t/, 2);
            var key  = parts[0];

            try {
                var data = JSON.parse(parts[1]);
                return cb(key, data);
            } catch(e) {
                process.stderr.write('Error Processing Line ' + line + ' ERROR:' + e + '\n');
            }
        });
    },

    iterateLinesWithGroupedJsonValues: function(cb) {
        var group      = [];
        var prevKey    = '';

        return this.iterateLines(function(line) {
            try {
                var parts      = line.split(/\t/, 2);
                var currentKey = parts[0];

                var data = JSON.parse(parts[1]);

                var promise;
                if ( prevKey && (currentKey !== prevKey) ) {
                    promise = ( cb(prevKey, group) || Promise.resolve() ).then(function() {
                        group = [];
                    });
                } else {
                    promise = Promise.resolve();
                }

                promise.then(function() {
                    group.push(data)
                });

                prevKey = currentKey;
                return promise;
            } catch(e) {
                process.stderr.write('Error Processing Line [' + line + '] ERROR:' + e + '\n');
            }
        }).then(function() {
            return new Promise(function(resolve) {
                return cb(prevKey, group, resolve);
            });
        });
    },

    emit: function(key, data) {
        console.log(key + "\t" + JSON.stringify(data));
    },

    iterateLines: function(cb) {
        process.stdin.resume();

        var linesQueue = [];
        var isClosedStream = false;
        var resolvePromise;
        var lastPromise = Promise.resolve();

        process.stdin.pipe(split()).on('data', function (line) {
            if (line == '') return;

            process.stdin.pause();
            linesQueue.push(line);

            processLine();
        }).on('error', function (err) {
            throw err;
        });

        function processLine() {
            if (!linesQueue.length) {
                if (!isClosedStream) {
                    process.stdin.resume();
                } else {
                    lastPromise.then(function() {
                        resolvePromise();
                    }).catch(console.error);
                }

                return;
            }

            var line = linesQueue.shift();

            lastPromise = lastPromise.then(function() {
                return cb(line);
            }).then(function() {
                processLine();
            });
        }

        return new Promise(function(resolve) {
            process.stdin.on('end', function(data) {
                isClosedStream = true;
                resolvePromise = resolve;
                processLine();
            });
        });
    }
};