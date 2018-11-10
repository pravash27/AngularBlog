//Main registration Controller



app.controller('registerController',['$rootScope','$scope','$window','$location',function($rootScope,$scope,$window,$location){
    $scope.register = function(){
      
      if($scope.registerForm.email.$valid && $scope.registerForm.password.$valid && ($scope.register.password==$scope.register.confPassword)){
          $rootScope.fireObject.auth().createUserWithEmailAndPassword($scope.register.email,$scope.register.password)
            .then(function(user){
              var file = document.getElementById('file').files[0];
              const uid = user.user.uid;
              var filename = "";
              if(file)
              {
                  filePath = 'user/'+uid+'/'+file.name;
                  $rootScope.fireObject.storage().ref(filePath).put(file).catch(function(error){
                  alert(error.mesaage);
                });
                filename = file.name;
              }
              $rootScope.fireObject.database().ref('users/'+uid).set({
                username:$scope.register.username,
                dob: Date($scope.register.dob),
                filename:file.name
              });
              alert("You've registered Successfully")
              $window.location.href="/login";
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


