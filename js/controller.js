(function(){
    "user strict";
    var barbershop = angular.module("barbershop",["ui.router"]);
    barbershop.factory('$setting',function($rootScope,$http){
        var service = {
            save:function(key,data){
                $http({
                    url:"/api/setting",
                    method:"POST",
                    data:JSON.stringify({"type":key,"value":data}),
                    headers:{
                        'Content-Type':"application/json",
                    }
                    
                }).then(function success(){
                    if(key === 'services'){
                        $rootScope.auth.services = data;
                    }
                    else{
                        $rootScope.auth.info[key] = data.value;
                    }
                
                },function error(){
                
                
                }); 
            
            },
        };
        return service;
    
    });
    barbershop.run(
      [   '$rootScope', '$state', '$stateParams','$http',
          function ($rootScope,   $state,   $stateParams, $http) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.auth = {
                    $userId: 1,
                    logined:true,
                    services: [
                        {id:1,name:"剪发",price:"25",orderNum:100},
                        {id:2,name:"染发",price:"25",orderNum:100},
                        {id:3,name:"烫发",price:"25",orderNum:100},
                    ],
                    info : {
                        type:"barbershop",
                        name:"南北理发店",
                        grade:4.5,
                        school:"北京邮电大学",
                        address:"北邮南门右拐50m",
                        phoneNum:"12345678901",
                        orderNum:"1200",
                    },
                };
                
                
                $http({
                    url:"/api/user",
                    method:"GET",
               
                }).then(function success(){
                
                },function error(){
                
                
                });
           }
        ]
     )
    barbershop.config(function($stateProvider,$urlRouterProvider){
            $urlRouterProvider.otherwise("/orders"); 
            $stateProvider
                .state("shopSearch",{
                    url:"/shops/search",
                    templateUrl:"views/shopSearch.html",
                    controller:['$scope','$rootScope',function($scope,$rootScope){
                        $scope.searchText = ""; 
                        $scope.search = function(){
                            if($scope.searchText === ""){
                                alert("搜索内容不能为空");
                                return;
                            } 
                            if($scope.searchText.length >20){
                                alert('搜索内容长度不能超过20');
                                return;
                            }
                            $rootScope.$state.go('shopList',{"searchText":$scope.searchText});
                        }
                    }],
                })
                .state("shopList",{
                    url:"/shops/{searchText:.{1,20}}",
                    templateUrl:"views/shopList.html",
                    controller:['$scope','$rootScope',function($scope,$rootScope){
                         
                    }],
                })
                        
                .state("shop",{
                    url:"/shop/{id:[0-9]{1,15}}",
                    templateUrl:"views/shopDetail.html",
                    controller:["$scope","$http",'$rootScope',function($scope,$http,$rootScope){
                        $scope.menu = "service";
                        $scope.footerMenu = 'shops';
                        $scope.services = [
                            {id:1,name:"剪发",price:"25",orderNum:100},
                            {id:2,name:"染发",price:"25",orderNum:100},
                            {id:3,name:"烫发",price:"25",orderNum:100},
                        ];
                        $scope.info = {
                            name:"南北理发店",
                            grade:4.5,
                            school:"北京邮电大学",
                            address:"北邮南门右拐50m",
                            phoneNum:"12345678901",
                            orderNum:"1200",
                        };
                        $scope.evaluations = [
                            {id:1, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                            {id:2, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                            {id:3, name:"萌萌", enviGrade:5, attiGrade:5, hairGrade:5,evaText:"很好，非常好",addTime:"2015/10/30"}, 
                        ];
                        $http({
                            method:"GET",
                            url:"/api/shop/"+$rootScope.$stateParams.id,
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    }],
                })
            .state("orders",{
                url:"/orders",
                templateUrl:"views/orderList.html",
                controller:["$scope", '$http','$rootScope',"$setting",function($scope,$http,$rootScope,$setting){
                    $scope.orders = [
                        {id:1,name:"张**",duration:"8:00 - 10:00",type:"剪发",status:"unchecked",shopName:"根爷店铺"},
                        {id:2,name:"李**",duration:"8:00 - 10:00",type:"剪发",status:"unchecked",shopName:"根爷店铺"},
                        {id:3,name:"王**",duration:"8:00 - 10:00",type:"剪发",status:"admited",shopName:"根爷店铺"},
                        {id:4,name:"刘**",duration:"8:00 - 10:00",type:"剪发",status:"admited",shopName:"根爷店铺"},
                        {id:5,name:"黄**",duration:"8:00 - 10:00",type:"剪发",status:"admited",shopName:"根爷店铺"},
                    ];
                    if($rootScope.auth.logined){
                         $http({
                            method:"GET",
                            url:"/api/orders/"+$rootScope.auth.$userId,
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    }
                                   
                }],
            })
            .state("mine",{
                url:"/mine",
                templateUrl:"views/mine.html",
                controller:['$scope','$rootScope',function($scope,$rootScope){
                     
                }],
            })
            .state("mineName",{
                url:"/mine/{name:[A-Za-z]{1,12}}",
                templateUrl:"views/mine_name.html",
                controller:['$scope', '$setting', '$rootScope',function($scope, $setting, $rootScope){
                    $scope.name = $rootScope.auth.info[$rootScope.$stateParams.name];
                    $scope.cancel = function(){
                        $rootScope.$state.go("mine");
                    };
                    $scope.submit = function(){
                        var name = $rootScope.$stateParams.name;
                        if(!$scope.name){
                            alert("名称不能为空");
                            return;
                        }
                        if(name === 'phoneNum'){
                            var reg = /^\d{11}$/;
                            if(!reg.test($scope.name)){
                                alert('手机格式不正确');
                                return;
                            }
                        }
                        $setting.save(name,$scope.name);
                    };
                }],
            })
            .state('mineService',{
                url:"/mine/service",
                templateUrl:"views/mine_service.html",
                controller:['$scope', '$setting', '$rootScope',function($scope, $setting, $rootScope){
                    $scope.services = [];
                    angular.copy($rootScope.auth.services, $scope.services);
                    $scope.removeService = function(index){
                        $scope.services.splice(index,1);
                    };
                    $scope.addService = function(){
                        $scope.services.push({id:undefined,name:"",price:""});
                    };
                    $scope.cancel = function(){
                        $rootScope.$state.go("mine");
                    };
                    $scope.submit = function(){
                        var reg = /^\d+$/
                        for(var i in $scope.services){
                            if(!$scope.services[i].name || !$scope.services[i].price){
                                alert("名称和金钱不能为空");
                                return;
                            }
                            else if(!reg.test($scope.services[i].price)){
                                alert("价格必须为整数。");
                                return;
                            }
                        }  
                        $setting.save('service',$scope.services);
                    };
                }],
            })
            


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
