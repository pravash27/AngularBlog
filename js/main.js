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
    }).when('/chngpassword',{
      templateUrl:'site-pages/chngpassword.html',
      controller:'passwordController'
    }).when('/forgotpass',{
      templateUrl:'site-pages/forgotpassword.html',
      controller:'forgotpasswordController'
    }).otherwise({
			redirectTo: '/login'
		});
		$locationProvider.html5Mode(true);
	}]);




//Firebase obj initialize in angular
 app.run(['$rootScope','$cookies','$location',function($rootScope,$cookies,$location){
     var config = {
        apiKey: "AIzaSyBIAe5imPmiS0dyS-NbO-5HwwlDolvc0SQ",
        authDomain: "agularapp-4c104.firebaseapp.com",
        databaseURL: "https://agularapp-4c104.firebaseio.com",
        projectId: "agularapp-4c104",
        storageBucket: "agularapp-4c104.appspot.com",
        messagingSenderId: "1072599141541"
      };
    firebase.initializeApp(config); 
    $rootScope.fireObject = firebase;
      $rootScope.isLogin = false;
      try{
        $rootScope.authData = JSON.parse(sessionStorage.getItem('authData'));
        $rootScope.isLogin = $rootScope.authData.userData.userLogin;
      }
      catch(error){
            $rootScope.authData = {userData:{}};
            $rootScope.isLogin = false;
      };
      $rootScope.getCurrentUser = function(){
        try{
            return $rootScope.authData.userData.email;
        }catch(error){
           return null;
        }
      };
        if($location.path() !== '/login' && !$rootScope.isLogin){
          $location.path('/login');
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
          firebase.auth().signOut().then(function() {
            sessionStorage.clear();
            window.location.href='/login';
          }).catch(function(error) {
          });
        } 
 }]);
