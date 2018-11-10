app.controller('passwordController',['$scope','$rootScope','$window',function($scope,$rootScope,$window){
    $scope.passwordResetLink = function(){    
        if($scope.chngPassword.password==$scope.chngPassword.confPassword)
        {
            var user = $rootScope.fireObject.auth().currentUser;
            user.updatePassword($scope.chngPassword.password).then(function(){
                alert('Password Updated');
                $window.location.href = '/home';               
            }).catch(function(error){
                alert(error.message);
            });
        }
    }
  }]);