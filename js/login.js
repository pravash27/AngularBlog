//Main login Controller
app.controller('loginController',['$rootScope','$scope','initContents','$cookies','$location',function($rootScope,$scope,initContents,$cookies,$location){
    $scope.validEmail = false;
    initContents.alert();
    $scope.validPassword = false;
    $scope.login = function(){
      $rootScope.fireObject.auth().signInWithEmailAndPassword($scope.login.email,$scope.login.password).then(function(user){
        $rootScope.fireObject.database().ref('/users/'+user.user.uid).on('value',function(snapshot){
          var userData = snapshot.val();
          firebase.storage().ref('user/'+user.user.uid+'/'+userData.filename).getDownloadURL().then(function(url){
            if(url){
              document.getElementById('userImage').setAttribute('src',url);
            }  
        });
        });
                   
          sessionStorage.setItem('login',"Welcome to Angular Blog");
          document.querySelector('#before-login').style.display="none";
          document.querySelector('#after-login').style.display="flex";
          $rootScope.$apply(function() {
            $location.path('/home');
          });  
         
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
