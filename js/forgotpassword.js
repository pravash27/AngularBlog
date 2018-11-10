app.controller('forgotpasswordController',['$scope','$rootScope','$window',function($scope,$rootScope,$window){
    $scope.sendPasswordResetLink = function(){
        const email = $scope.forgotPassword.email;
        $rootScope.fireObject.auth().sendPasswordResetEmail(email).then(function(){
            alert("Email sent to Specified EmailID")
        }).catch(function(error){
            alert(error.message)
        })    
    }
  }]);