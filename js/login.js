//Main login Controller
app.controller('loginController',['$rootScope','$scope','initContents','$cookies','$location','checkCredentials',function($rootScope,$scope,initContents,$cookies,$location,checkCredentials){
    $scope.validEmail = false;
    $scope.showLoader = false;
    initContents.alert();
    $scope.validPassword = false;
    $scope.login = function(){
          $scope.showLoader = true;
          checkCredentials.login($scope.login.email,$scope.login.password).then(function(data){
            checkCredentials.getUserImage(data.uid,data.userData.filename).then(function(url){
                $rootScope.$apply(function(){
                  $rootScope.imageURL = url;
                })
            }).catch(function(error){

            });
            sessionStorage.setItem('login',"Welcome to Angular Blog");
            $rootScope.$apply(function() {
              $rootScope.isLogin = true;
              $rootScope.username=data.userData.username;
              $location.path('/home');
            });
          }).catch(function(error){
            $scope.$apply(function(){
              $scope.showLoader = false;
            })
            switch(error.code){
              case "auth/auth/invalid-email": alert("Email is not Valid");break;
              case "auth/user-disabled": alert("Account is already closed");break;
              case "auth/user-not-found": alert("Invalid User");break;
              case "auth/wrong-password": alert("Wrong Password");break;
              default: alert(error.message);
            } 
        }); 
    }
}]);
