var assert = require('assert');

var bcs = require('rapid-access')('bcs://h3qEDvSuECzBgOqzZnR3uX21:ShffmvmunP0hIMzG75oIhbnT619za18K@bcs.duapp.com/kyrios');

describe('storage', function () {
    var data = 'Lorem ipsum dolor sit amet\ufffc';
    it('set', function (next) {
        bcs.set('/test.txt', data).then(function () {
            next();
        }).done();
    });
    it('get', function (next) {
        bcs.get('/test.txt').then(function (ret) {
            assert(ret.toString() === data);
            next();
        }).done();
    });
    it('delete', function (next) {
        bcs.delete('/test.txt').then(function () {
            return bcs.get('/test/txt');
        }).then(function (ret) {
            assert(ret === undefined);
            next();
        }).done();
    });
});

describe('http', function () {
    var data = 'Lorem ipsum dolor sit amet\ufffd';
    it('open for put', function (next) {
        var entry = bcs.open({method: 'PUT', path: '/test.txt'});
        entry.end(data);
        entry.on('data', Boolean).on('end', function () {
            bcs.get('/test.txt').then(function (ret) {
                assert(ret.toString() === data);
                next();
            }).done();
        });
    });
    it('open for get', function (next) {
        var entry = bcs.open({method: 'GET', path: '/test.txt'});
        entry.end();
        var bufs = [];
        entry.on('data', bufs.push.bind(bufs)).on('end', function () {
            var ret = Buffer.concat(bufs);
            assert(ret.toString() === data);
            next();
        });
    })
});
