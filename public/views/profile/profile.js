(function()
{
    angular
        .module("ProfileApp")
        .controller('ProfileCtrl', ProfileCtrl);
    // profile controller
    function ProfileCtrl($scope, $http, $location,$rootScope)
    {
        if($rootScope.currentUser.displayname){
          $rootScope.welcomename = $rootScope.currentUser.displayname;
        }
        else {
          $rootScope.welcomename = $rootScope.currentUser.username;
        }

        $rootScope.editmessage = "Please Update Your Profile";

        $scope.update = function(user)
        {
            $http.put('/rest/user/'+user._id, user)
            .success(function(users)
            {
                $scope.users = users;
                $location.url("/profile");
            });
        }

        $scope.changePass = function(user)
        {
          if((user.curpassword != user.password) || (user.newpassword != user.newpassword2) || !user.curpassword || !user.newpassword || !user.newpassword2)
          {
              $rootScope.editmessage = "Your passwords don't match";
          }

          else{
            user.password = user.newpassword; //update the password
            $http.put('/rest/user/'+user._id, user)
            .success(function(users)
            {
                $scope.users = users;
                $location.url("/profile");
            });
          }
        }

        $scope.edit = function()
        {
          $location.url("/editprofile");
        }

        $scope.cancel = function()
        {
          $location.url("/profile");
        }

        // image upload handling
        $scope.onUploadSelect = function getImage(input){
          
          }
        // upload end
    }
})();
