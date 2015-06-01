'use strict';

var Promise = require('bluebird');
var split = require('split');

var hadoopStreamingUtils = {
    iterateLines: function(cb) {
        process.stdin.resume();
        var lastPromise = Promise.resolve();
        var isClosedStream = false;

        process.stdin.pipe(split()).on('data', function (line) {
            if (line == '') return;
            process.stdin.pause();

            lastPromise = lastPromise.then(function() {
                return cb(line);
            }).then(function() {
                if (!isClosedStream) {
                    process.stdin.resume();
                }
            });
        }).on('error', function (err) {
            throw err;
        });

        return new Promise(function(resolve) {
            process.stdin.on('end', function() {
                isClosedStream = true;
                lastPromise.then(function() {
                    resolve();
                }).catch(console.error);
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
        var prevKey;

        return hadoopStreamingUtils.iterateLines(function(line) {
            var parts      = line.split(/\t/, 2);

            var currentKey = parts[0];
            var data       = parts[1];

            var promise;
            if ( prevKey !== void(0) && (currentKey !== prevKey) ) {
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
            return ( cb(prevKey, group) || Promise.resolve() );
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
        console.log(key + "\t" + data);
    },

    emitJson: function(key, data) {
        console.log(key + "\t" + JSON.stringify(data));
    },

    incrementCounter: function(group, counter, amount) {
        process.stderr.write('reporter:counter:' + group + ',' + counter + ',' + amount + '\n');
    }
};

module.exports = hadoopStreamingUtils;