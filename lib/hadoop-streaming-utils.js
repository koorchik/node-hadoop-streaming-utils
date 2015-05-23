'use strict';

var Promise = require('bluebird');
var split = require('split');

var hadoopStreamingUtils = {
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
    },

    iterateKeysWithValues: function(cb) {
        return hadoopStreamingUtils.iterateLines(function(line) {
            var parts = line.split(/\t/, 2);
            var key   = parts[0];

            return cb(key, parts[1]);
        });
    },

    iterateKeysWithGroupedValues: function(cb) {
        var group      = [];
        var prevKey    = '';

        return hadoopStreamingUtils.iterateLines(function(line) {
            var parts      = line.split(/\t/, 2);

            var currentKey = parts[0];
            var data       = parts[1];

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
        }).then(function() {
            return new Promise(function(resolve) {
                return cb(prevKey, group, resolve);
            });
        });
    },

    iterateJsonLines: function(cb) {
        return hadoopStreamingUtils.iterateLines(function(line) {
            try {
                var data = JSON.parse(line);
                return cb(data);
            } catch(e) {
                process.stderr.write('Error Processing Line ' + line + ' ERROR:' + e + '\n');
            }
        });
    },

    iterateKeysWithJsonValues: function(cb) {
        return hadoopStreamingUtils.iterateKeysWithValues(function(key, data) {
            try {
                var data = JSON.parse(data);
                return cb(key, data);
            } catch(e) {
                process.stderr.write('Error processing string ' + data + ' ERROR:' + e + '\n');
            }
        });
    },

    iterateKeysWithGroupedJsonValues: function(cb) {
        return hadoopStreamingUtils.iterateKeysWithGroupedValues(function(key, group) {
            var unserializedGroup = group.map(function(item) {
                try {
                    return JSON.parse(item);
                } catch(e) {
                    process.stderr.write('Error Processing Line [' + item + '] ERROR:' + e + '\n');
                }
            });

            return cb(key, unserializedGroup);
        });
    },

    emit: function(key, data) {
        console.log(key + "\t" + JSON.stringify(data));
    },
};

module.exports = hadoopStreamingUtils;