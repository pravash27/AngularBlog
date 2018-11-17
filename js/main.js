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
    },
    uploadUserData:function(userData,uid){
      return firebase.database().ref("users/"+uid).set(userData);
    },
    uploadFile:function(file,uid){
      var promise = new Promise(function(resolve,reject){
        if(file){
          var filePath = "user/"+uid+"/"+file.name;
          firebase.storage().ref(filePath).put(file).then(function(){
            resolve(file.name);
            }).catch(function(error){
                reject("");
            });
        }else{
          resolve("");
        }
      });
      return promise;
    },
    registerUser:function(email,password){
        return firebase.auth().createUserWithEmailAndPassword(email,password)
    },
    getUserData:function(uid){
    		var promise = new Promise(function(resolve,reject){
    			firebase.database().ref('/users/'+uid).on('value',function(snapshot){
    				var snapshotData = {
    					uid:uid,
    					userData:snapshot.val()
    				}
    				resolve(snapshotData);
	        	},function(error){
	            console.dir(error);
	        	});
    		});
    		return promise;
    		
    },
    getUserImage:function(uid,filename){
    		return firebase.storage().ref('user/'+uid+'/'+filename).getDownloadURL();
    },
    login:function(email,password){
      var promise = new Promise(function(resolve,reject){
        firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
          firebase.database().ref('/users/'+user.user.uid).on('value',function(snapshot){
            var data = {
              uid:user.user.uid,
              userData:snapshot.val()
            }
            resolve(data);
          });
      }).catch(function(error){
        reject(error);
      })
      
    });
    return promise;
  }
}
});

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
    	var promise = new Promise(function(resolve,reject){
    		setTimeout(function(){
        		if(!checkCredentials.userSignedIn()){
			        $rootScope.$apply(function() {
                if($location.path()=='/register'){
                  $location.path('/register');
                }else{
                  $location.path('/login');
                }
			        }); 
			        resolve();
        		}else{
		            var uid = $rootScope.fireObject.auth().currentUser.uid;
		            if($location.path()=='/login' || $location.path()=='/register'){
		              $rootScope.$apply(function() {
		                $location.path("/home");
		              });
            		}
            		resolve(checkCredentials.getUserData(uid))
            	}
        		
      			},3000);
    	})
      	return promise;
   	}
    
    
    data.alert = function(){
      var alertData="";
      var label = "";
      var time = 3000;
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
  $rootScope.username = "Anonymous";
  $rootScope.imageURL = "images/img_avatar.png"
  $rootScope.isLogin = false;
  $rootScope.logout = function(){
      firebase.auth().signOut().then(function() {
          sessionStorage.clear();
          sessionStorage.setItem('logout',"Thanks!!!!!!");
          $rootScope.isLogin = false;
          $rootScope.$apply(function(){
            $location.path('/login');
          })
        }).catch(function(error){
        
        });
    }
    $scope.init = function(){
      initContents.checkLoginStatus().then(function(data){
          document.querySelector('.preloader').style.display="none";
      		if(data){
            $rootScope.isLogin = true; 
      			$scope.$apply(function(){
            $rootScope.username = data.userData.username;
            if(data.userData.filename){
              checkCredentials.getUserImage(data.uid,data.userData.filename).then(function(url){
                $scope.$apply(function(){
                $rootScope.imageURL = url;
                })
              })
            }
      	  })
      		}		
      });
    }
 }]);

app.controller('homeController',['$scope','initContents',function($scope,initContents){
  initContents.alert();
 
 }]);