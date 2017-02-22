import http from 'http'

var httpService = {


};

httpService.commonPost = function(url, data, suc, err) {

    data = JSON.stringify(data);
    var opt = {
        method: "POST",
        host: "127.0.0.1",
        port: 8080,
        path: url,
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": data.length,
            "User-Agent":'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko'
        }
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
    req.write(data + "\n");
    req.end();
}


export default httpService;
