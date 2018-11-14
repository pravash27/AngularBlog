//Main login Controller
app.controller('loginController',['$rootScope','$scope','initContents','$cookies','$window',function($rootScope,$scope,initContents,$cookies,$window){
    $scope.validEmail = false;
    initContents.alert();
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
          sessionStorage.setItem('login',"Welcome to Angular Blog");
          sessionStorage.setItem('authData',JSON.stringify($scope.authData));
          $window.location.href = '/home';
         
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
}]);
