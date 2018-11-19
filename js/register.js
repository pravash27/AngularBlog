//Main registration Controller

app.directive('ngFileContent',function(){
  return {
    link:function(scope,element,attribute){
      element.bind('change',function(e){
        var reader = new FileReader();

        reader.onload = function(e){
          var img = document.getElementById('uploadImage')
          img.style.cssText = "width: 100%;height: 100px;";
          img.setAttribute('src',e.target.result);
        };
        reader.readAsDataURL(e.target.files[0])
      })
    }
  }
})

app.controller('registerController',['$rootScope','$scope','$route','$location','checkCredentials',function($rootScope,$scope,$route,$location,checkCredentials){
  $scope.showLoader = false;  
  $scope.register = function(){
      $scope.showLoader = true;
      if($scope.registerForm.email.$valid && $scope.registerForm.password.$valid && ($scope.register.password==$scope.register.confPassword)){
        checkCredentials.registerUser($scope.register.email,$scope.register.password)
        .then(function(user){
              checkCredentials.uploadUserData({
                username:$scope.register.username,
                dob:Date($scope.register.dob)
              },user.user.uid).then(function(){
                window.location.reload();
              }).catch(function(error){
                $scope.$apply(function(){
                  $scope.showLoader="false";
                });
                alert(error.message);  
              });
            }).catch(function(error){
            $scope.$apply(function(){
              $scope.showLoader="false";
            });  
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


