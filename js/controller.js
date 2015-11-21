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
                        type:"customer",
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
                .state("shopSearch",{ //周围店铺
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
                .state("shopList",{   //店铺列表
                    url:"/shops/search/{searchText:.{1,20}}",
                    templateUrl:"views/shopList.html",
                    controller:['$scope','$rootScope','$http',function($scope,$rootScope,$http){
                        var searchText = $rootScope.$stateParams.searchText;
                        $scope.shopList = [
                            {id:1,eva_score:"5",name:'洗剪吹理发店',orderNum:100,address:"北京邮电大学北门"},
                            {id:2,eva_score:"4",name:'洗剪吹理发店',orderNum:100,address:"北京邮电大学北门"},
                            {id:3,eva_score:"3",name:'洗剪吹理发店',orderNum:100,address:"北京邮电大学北门"},
                            {id:4,eva_score:"2",name:'洗剪吹理发店',orderNum:100,address:"北京邮电大学北门"},
                        ]; 
                        $http({
                            url:"/api/shopList/"+searchText,
                            method:'GET',
                        }).then(
                            function success(data){
                                
                            },
                            function error(data){
                                
                            }
                        
                        ); 
                    }],
                })
                        
                .state("shop",{//店铺详情
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
                            id:1,
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
            .state('appointment',{ //预约
                url:"/shop/{id:[0-9]{1,15}}/appointment",
                templateUrl:"views/appointment.html",
                controller:["$scope", '$http','$rootScope',"$setting",function($scope,$http,$rootScope,$setting){
                    if(!$rootScope.auth.logined){
                        $rootScope.$state.go("login");
                        return;
                    }
                    $scope.services= [
                        {id:1,type:"剪发",price:"25",shopId:"13213233323"},
                        {id:2,type:"烫发",price:"25",shopId:"13213233323"},
                        {id:3,type:"染发",price:"25",shopId:"13213233323"},
                        {id:4,type:"接发",price:"25",shopId:"13213233323"},
                    ];
                    $scope.pay = function(){ //支付约定 跳过实际支付界面，将钱转到中间账户， 然后跳转到订单页面
                         $http({
                            url:"/api/appointment",
                            method:"POST",
                            data:JSON.stringify({shopId:$rootScope.$stateParams,id:$rootScope.auth.$userId}),
                         }).then(
                            function success(data){   
                                $rootScope.$state.go('orders');        
                            },
                            function error(){
                                alert("支付出错");
                            }
                         );
                    
                    }
                    $http({ //获取服务项目
                        url:"",
                        method:"GET",
                         
                    }).then(function success(){
                    
                    
                    }, function error(){
                    
                    
                    });
                    $scope.selectedType = ""+$scope.services[0].id;//选择的服务项目
                    $scope.selectedTime = "8:00~10:00";//选择的服务时间
                }]
            })
            .state("evaluation",{
                url:"/orders/{orderId:[0-9]{1,15}}/evaluation",
                templateUrl:"views/evaluation.html",
                controller:["$scope", '$http','$rootScope',function($scope,$http,$rootScope){
                    $scope.evaluation = {
                        enviGrade : 0,      
                        attiGrade : 0, 
                        hairGrade : 0,  
                        evaText :"",    
                    };
                    $scope.submit = function(){
                        if($scope.evaluation.enviGrade === 0 || $scope.evaluation.attiGrade === 0 ||$scope.evaluation.hairGrade === 0 || $scope.evaluation.evaText === ""){
                            alert("信息没有填完整");
                            return;
                        } 
                        $http({
                            url:'/api/reviews/' + $rootScope.$stateParams.orderId,
                            method:"POST",
                            headers:{
                            
                            }
                        
                        }).then(
                            function success(){
                                $rootScope.$state.go('orders');      
                            },
                            function error(){
                            
                            
                            }
                        )
                    
                    };    
                    $scope.clickstar = function(type,index){
                        type += "Grade";
                        $scope.evaluation[type] = index;
                    };

                }]
            })
            .state("orders",{//订单
                url:"/orders",
                templateUrl:"views/orderList.html",
                controller:["$scope", '$http','$rootScope',"$setting",function($scope,$http,$rootScope,$setting){
                    $scope.orders = [
                        {id:1,name:"张**",duration:"8:00 - 10:00",type:"剪发",status:"unchecked",shopName:"根爷店铺"},
                        {id:2,name:"李**",duration:"8:00 - 10:00",type:"剪发",status:"admited",shopName:"根爷店铺"},
                        {id:3,name:"王**",duration:"8:00 - 10:00",type:"剪发",status:"refused",shopName:"根爷店铺"},
                        {id:4,name:"刘**",duration:"8:00 - 10:00",type:"剪发",status:"confirmHairCut",shopName:"根爷店铺"},
                        {id:5,name:"黄**",duration:"8:00 - 10:00",type:"剪发",status:"evaluated",shopName:"根爷店铺"},
                    ];
                    $scope.confirmPay = function(index){ //确认理完发 将款项打到商家账户
                         $http({
                            method:"POST",
                            url:"/api/orders/"+$scope.orders[index].id,
                            data:JSON.stringify({userId:$rootScope.auth.$userId,'operation':"confirmHairCut"}),
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    
                    };
                    $scope.refuse = function(index){
                         $http({
                            method:"POST",
                            url:"/api/orders/"+$scope.orders[index].id,
                            data:JSON.stringify({userId:$rootScope.auth.$userId,'operation':"refused"}),
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    };
                    $scope.admit = function(index){
                         $http({
                            method:"GET",
                            url:"/api/orders/"+$scope.orders[index].id,
                            data:JSON.stringify({'operation':"refused"}),
                            headers:{
                                "Content-Type":"application/json",
                            }
                        }).then(function successCallback(data){
                        },function errorCallback(data){
                        });
                    };
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
            .state("mine",{ //我的
                url:"/mine",
                templateUrl:"views/mine.html",
                controller:['$scope','$rootScope',function($scope,$rootScope){
                     
                }],
            })
            .state("mineName",{ //设置修改
                url:"/mine/item/{name:[A-Za-z]{1,12}}",
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
            .state('mineService',{ //设置 服务修改
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
