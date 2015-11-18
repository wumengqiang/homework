(function(){
    "user strict";
    var barbershop = angular.module("barbershop",["ui.router"]);
    barbershop.config(function($stateProvider,$urlRouterProvider){
            $urlRouterProvider.otherwise("/shop"); 
            $stateProvider
                .state("shop",{
                    url:"/shop",
                    templateUrl:"views/shopDetail.html",
                    controller:["$scope","$http",function($scope,$http){
                        $scope.menu = "service";
                        $scope.footerMenu = 'shops';
                        $scope.services = [
                            {id:1,name:"剪发",price:"25",orderNum:100},
                            {id:2,name:"染发",price:"25",orderNum:100},
                            {id:3,name:"烫发",price:"25",orderNum:100},
                        ];
                        $scope.info = {
                            id:1,
                            name:"南北理发店",
                            address:"北邮南门右拐50m",
                            phone:"12345678901",
                        };
                        $scope.evaluation = [
                            {id:1, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                            {id:2, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                            {id:3, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                        ];
                        $http({
                            method:"GET",
                            url:"/api/shop",
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    }],
                })
            .state("shop.order",{
                url:"/{shopId:[0-9]{1,15}}/order",
                templateUrl:"views/order.html",
                controller:["$scope", '$http',function($scope,$http){
                 
                
                }],

            })
            
            )

                 
       });
        

    barbershop.controller("AuthControl", ['$scope','$http',function($scope,$http){
        document.title="周围店铺";
        $scope.logined = false ;
        $scope.name = "金春根";
        $http({
            method:"GET",
            url:"/api/auth",
            headers:{
                "Content-Type":"application/json",
            }
        }).then(function successCallback(data){
            
            
        },function errorCallback(data){
            
            
        });
    }]);
})();
