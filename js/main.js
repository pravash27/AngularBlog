angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));
//Initialize angular app
var app = angular.module('blogApp',['ngRoute','ngCookies']);



//Router Config
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $routeProvider.when('/home',{
      templateUrl:'site-pages/home.html',
      controller: "homeController"
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
			redirectTo: '/home'
		});
		$locationProvider.html5Mode(true);
	}]);

app.factory('checkCredentials',function(){
  return {
    userSignedIn:function(){
      return firebase.auth().currentUser;
    }
  }
})


//Firebase obj initialize in angular
 app.run(['$rootScope','$cookies','$location','checkCredentials',function($rootScope,$cookies,$location,checkCredentials){
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
}]);

app.factory('initContents',['$rootScope','checkCredentials','$location',function($rootScope,checkCredentials,$location){
    var data = {}; 
    
    data.checkLoginStatus = function(){
      var user =  checkCredentials.userSignedIn();
      setTimeout(function(){
        var userdata;
        if(!user){
          document.querySelector('#before-login').style.display="flex";
          document.querySelector('#after-login').style.display="none";
          $rootScope.$apply(function() {
            $location.path('/login');
          });  
        }else{
            document.querySelector('#before-login').style.display="none";
            document.querySelector('#after-login').style.display="flex";
            var uid = $rootScope.fireObject.auth().currentUser.uid;
            document.querySelector('.preloader').style.display="none";
            if($location.path()=='/login' || $location.path()=='/register'){
              $rootScope.$apply(function() {
                $location.path("/home");
              });
            }
            $rootScope.fireObject.database().ref('/users/'+uid).on('value',function(snapshot){
              var userData = snapshot.val();
              firebase.storage().ref('user/'+uid+'/'+userData.filename).getDownloadURL().then(function(url){
                  if(url){
                    document.getElementById('userImage').setAttribute('src',url);
                  }  
              });
            },function(error){
              console.dir(error);
            });
        }
      },3000);
    
   }
    
    
    data.alert = function(){
      var alertData="";
      var label = "";
      var time = 4000;
      if(sessionStorage['login']){
        alertData = document.getElementById('login');
        label = "login";
      }else if(sessionStorage['logout']){
        alertData = document.getElementById('logout');
        label="logout";
      }
      if(alertData!="" && alertData!=undefined){
        alertData.innerHTML = sessionStorage[label]
        alertData.style.display = 'block';
        setTimeout(function(){
            alertData.style.display = "none";
            sessionStorage.removeItem(label);
        },time);
      }
      

    }
    return data;
}]);


//Main Blog controller
app.controller('blogController',['$rootScope','$scope','initContents','$cookies','checkCredentials','$location',function($rootScope,$scope,initContents,$cookies,checkCredentials,$location){
  
  $scope.logout = function(){
      firebase.auth().signOut().then(function() {
          sessionStorage.clear();
          sessionStorage.setItem('logout',"Thanks!!!!!!")
          //window.location.href='/login';
          $rootScope.$apply(function(){
            $location.path('/login');
          })
        }).catch(function(error){
        
        });
    }
    $scope.init = function(){
      initContents.checkLoginStatus();
    }
 }]);

 app.controller('homeController',['$scope','initContents',function($scope,initContents){
  initContents.alert();
 
 }]);