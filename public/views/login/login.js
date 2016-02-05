(function()
{
    angular
        .module("ProfileApp")
        .controller("LoginCtrl", LoginCtrl);
    // login controller 
    function LoginCtrl($scope, $http, $location, $rootScope)
    {
      $rootScope.loginmessage = "Please Enter Your Email and Password";
        $scope.login = function(user)
        {
            $rootScope.loginmessage = "Username and Password is Incorrect";
            $http.post("/login", user)
            .success(function(response)
            {
                $rootScope.currentUser = response;
                $location.url("/profile");
            });

        }
    }

})();
