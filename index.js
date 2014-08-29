var Http = require('rapid-access').Http,
    crypto = require('crypto'),
    Q = require('q');

exports.instance = function (options) {
    return new BCS(options);
};

function BCS(options) {
    if (options.user) { // ak:sk
        options.ak = options.user;
        options.sk = options.password;
        options.user = options.password = null;
    }
    delete options.protocol;
}

require('util').inherits(BCS, Http);

BCS.prototype.impl = {
    http: true,
    storage: true
};

BCS.prototype._conf = {
    resource: null,
    ak: null,
    sk: null,
    clusters: null,
    maxConnects: 30,
    retryTimeout: 400,
    maxRetries: 3
};

BCS.prototype.request = function (options, data) {
    var object = options.path, url = '/' + this._conf.resource + object;
    var conf = this._conf;
    if (conf.ak) {
        url += '?sign=MBO:' + conf.ak + ':' + encodeURIComponent(
            crypto.createHmac('sha1', conf.sk)
                .update('MBO\nMethod=' + (options.method || 'GET') + '\nBucket=' + conf.resource + '\nObject=' + object + '\n')
                .digest('base64'));
    }

    options.path = url;
    return Http.prototype.request.call(this, options, data);
};

BCS.prototype.get = function (object) {
    var deferred = Q.defer();
    Http.prototype.get.call(this, object).then(deferred.resolve, function (err) {
        if (err.status === 404) {
            deferred.resolve();
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

BCS.prototype.set = BCS.prototype.put;

BCS.prototype.open = function (options) {
    var object = options.path, url = '/' + this._conf.resource + object;
    var conf = this._conf;
    if (conf.ak) {
        url += '?sign=MBO:' + conf.ak + ':' + encodeURIComponent(
            crypto.createHmac('sha1', conf.sk)
                .update('MBO\nMethod=' + (options.method || 'GET') + '\nBucket=' + conf.resource + '\nObject=' + object + '\n')
                .digest('base64'));
    }

    options.path = url;
    return Http.prototype.open.call(this, options);
};