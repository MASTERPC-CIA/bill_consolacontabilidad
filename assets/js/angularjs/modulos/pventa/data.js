app.factory("Data", ['$http', '$location','toaster',
    
    function ($http, $location, toaster) {

        var serviceBase = 'index/';

        var obj = {};

        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }

        obj.get = function (q) {
            obj.session();
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        obj.post = function (q, object) {
            obj.session();
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.put = function (q, object) {
            obj.session();
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };

        obj.delete = function (q) {
            obj.session();
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        obj.session = function () {
            /*$http.post(serviceBase + 'check_session').then(function (results) {
                if(results.data.rta==0){
                    $location.path('/login');
                }
            });*/
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