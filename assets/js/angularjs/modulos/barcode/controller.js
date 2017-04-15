app.controller('ctrlProductCant', function ($scope, Data) {
    Data.post('logo').then(function (result) {
        $scope.logo = result.valor;
    });

    $scope.consultar = function (producto) {
        Data.post('generar_x_producto_cantidad',producto).then(function () {
        });
    };
});

app.controller('HomeCtrl', ['$scope','Data', 'upload', function ($scope, Data, upload) {
    Data.post('logo').then(function (result) {
        $scope.logo = result.valor;
    });

    $scope.uploadFile = function()
    {
        upload.uploadFile($scope.file).then(function(res)
        {
            send = {"name":$scope.file.name};
            Data.post('save_logo',send).then(function (result) {
                $scope.logo = result.valor;
            }); 
        })
    }
}])

app.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) 
        {
            iElement.on("change", function(e)
            {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}])

app.service('upload', ["$http", "$q", function ($http, $q) 
{
    this.uploadFile = function(file)
    {
        var deferred = $q.defer();
        var formData = new FormData();
        formData.append("file", file);
        return $http.post("etiquetas/load_server", formData, {
            headers: {
                "Content-type": undefined
            },
            transformRequest: angular.identity
        })
        .success(function(res)
        {
            deferred.resolve(res);
        })
        .error(function(msg, code)
        {
            deferred.reject(msg);
        })
        return deferred.promise;
    }
}])