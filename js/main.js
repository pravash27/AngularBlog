angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));
//Initialize angular app
var app = angular.module('blogApp',['ngRoute','ngCookies']);



//Router Config
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $routeProvider.when('/home',{
			templateUrl:'site-pages/home.html'
		}).when('/about',{
			templateUrl:'site-pages/about.html'
		}).when('/login',{
			templateUrl:'site-pages/login.html',
      controller:'loginController'
		}).when('/register',{
      templateUrl:'site-pages/register.html',
      controller:'registerController'
    }).otherwise({
			redirectTo: '/login'
		});
		$locationProvider.html5Mode(true);
	}]);




//Firebase obj initialize in angular
 app.run(['$rootScope','$cookies','$location',function($rootScope,$cookies,$location){
      $rootScope.fireObject = firebase;
      try{
        $rootScope.authData = JSON.parse(sessionStorage.getItem('authData'))
      }
      catch(error){
            $rootScope.authData = {userData:{}};
      };
      $rootScope.getCurrentUser = function(){
        try{
            return $rootScope.authData.userData.email;
        }catch(error){
           return "";
        }
      };
      try{
        if($location.path() !== '/login' && !$rootScope.authData.userData.userLogin){
          $location.path('/login')
        }else{
          $location.path('/home');
        }
      }catch(error){
        $location.path('/login')
      }
      
}])



app.factory('initContents',['$rootScope',function($rootScope){
    var data = {}; 
    data.initNavContents = function(){
        if($rootScope.getCurrentUser()){
            document.querySelector('#before-login').style.display="none";
            document.querySelector('#after-login').style.display="flex";
        }else{
            document.querySelector('#before-login').style.display="flex";
            document.querySelector('#after-login').style.display="none";
        }
    }
    return data;
}]);


//Main Blog controller
app.controller('blogController',['$rootScope','$scope','initContents','$cookies',function($rootScope,$scope,initContents,$cookies){
        initContents.initNavContents();
        $scope.logout = function(){
            
            sessionStorage.clear();
            window.location.href='/login';
        } 
    }]);

//Main login Controller
app.controller('loginController',['$rootScope','$scope','initContents','$cookies','$location',function($rootScope,$scope,initContents,$cookies,$location){
    $scope.validEmail = false;
    $scope.validPassword = false;
    $scope.login = function(){
      $rootScope.fireObject.auth().signInWithEmailAndPassword($scope.login.email,$scope.login.password).then(function(user){
          alert('successfully login');
          $rootScope.authData = {
                userData:{
                userLogin:true,
                email:user.user.email,
                uid:user.user.uid
              }
            };

         $cookies.put('demo',"dsfsdfsd");
         sessionStorage.setItem('authData',JSON.stringify($scope.authData));
          $location.path('/home');
         
      }).catch(function(error){
          switch(error.code){
            case "auth/auth/invalid-email": alert("Email is not Valid");break;
            case "auth/user-disabled": alert("Account is already closed");break;
            case "auth/user-not-found": alert("Invalid User");break;
            case "auth/wrong-password": alert("Wrong Password");break;
            default: alert(error.message);
          } 
      });
    }
  }])

//Main registration Controller
app.controller('registerController',['$rootScope','$scope','$window',function($rootScope,$scope,$window){
    $scope.register = function(){
      
      if($scope.registerForm.email.$valid && $scope.registerForm.password.$valid && ($scope.register.password==$scope.register.confPassword)){
          $rootScope.fireObject.auth().createUserWithEmailAndPassword($scope.register.email,$scope.register.password)
            .then(function(user){
              var file = document.getElementById('file').files[0];
              const uid = user.user.uid;
              var actFilePath = "";
              if(file)
              {
                  filePath = 'user/'+uid+"/"+file.name;
                  $rootScope.fireObject.storage().ref(filePath).put(file).then(function(fileSnapshot){
                    return fileSnapshot.ref.getDownloadURL().then((url)=>{
                      $rootScope.fireObject.database().ref('users/'+uid).set({
                        filePath:url
                      });
                    });
                 }).catch(function(error){
                  alert(error.mesaage);
                });
                console.dir(actFilePath);
              }
              $rootScope.fireObject.database().ref('users/'+uid).set({
                username:$scope.register.username,
                dob: Date($scope.register.dob),
              });
              $window.location.href='/login';
            })
            .catch(function(error){
              switch(error.code){
                case "auth/email-already-in-use": alert("Email is already taken");break;
                case "auth/invalid-email": alert("Email is not Valid");break;
                case "auth/operation-not-allowed": alert("Account not Enabled");break;
                case "auth/email-already-in-use": alert("Email is already taken");break;
                default: alert(error.message);
              }
          });
        }else{
          alert("Invalid Data");
        }
      
    }
  }]);