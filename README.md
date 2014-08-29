RAPID-BCS
====

node.js BCS 客户端
 
###安装

    npm install q rapid-access rapid-memcache

###使用

    
    var bcs = require('rapid-access')('bcs://yourAccessKey:yourSecretKey@bcs.duapp.com/yourBucket');

    bcs.set('/test.txt', 'hello world').then(function(){
        cache.get('/test.txt').then(function(ret){
            ...
        });
    });

更多API详情参考 [clouda+](http://cloudaplus.duapp.com/) 