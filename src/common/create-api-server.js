const http = require('http')

var httpService = {


};

httpService.commonPost = function(url, data, suc, err) {
    console.log(data);
    data = JSON.stringify(data);
    var opt = {
        method: "POST",
        host: "127.0.0.1",
        port: 3000,
        path: url,
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": data.length,
            "User-Agent": 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko'
        }
    };

    var req = http.request(opt, function(serverFeedback) {
       
        console.log('serverFeedback.statusCode==='+serverFeedback.statusCode);
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function(data) { body += data; })
                .on('end', function() {
                    suc(JSON.parse(body));
                });
        } else {
            err(500);
        }
    });
    req.write(data + "\n");
    req.end();
}


httpService.commonGet = function(url, suc, err) {

    var opt = {
        method: "GET",
        host: "127.0.0.1",
        port: 3000,
        path: url
    };

    var req = http.request(opt, function(serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function(data) { body += data; })
                .on('end', function() {
                    suc(JSON.parse(body));
                });
        } else {
            err(500);
        }
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}


module.exports = httpService;
