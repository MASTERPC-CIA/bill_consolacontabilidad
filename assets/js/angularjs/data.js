app.factory("Data", ['$http', '$location','toaster',
    
    function ($http, $location, toaster) {

        var obj = {};

        obj.toast = function (data) {
            console.log(data);
            switch(data.msg_tipo) {
                case "1":
                    toaster.pop("success", "SATISFACTORIO", data.msg_valor, 10000, 'trustedHtml');
                    break;
                case "2":
                    toaster.pop("info", "INFORMACION", data.msg_valor, 10000, 'trustedHtml');
                    break;
                case "3":
                    toaster.pop("warning", "ADVERTENCIA", data.msg_valor, 10000, 'trustedHtml');
                    break;
                case "4":
                    toaster.pop("error", "ERROR", data.msg_valor, 10000, 'trustedHtml');
                    break;
            }
        }

        obj.get = function (serviceBase, q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        obj.post = function (serviceBase, q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                obj.toast(results.data.msg);
                return results.data;
            });
        };

        obj.put = function (serviceBase, q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.delete = function (serviceBase, q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        
        return obj;
}]);

app.factory("MyService", function() {
  return {
    data: {}
  };
});

app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.message = {};

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});