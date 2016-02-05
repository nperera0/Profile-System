(function()
{
    angular
        .module("ProfileApp")
        .controller("RegisterCtrl", RegisterCtrl);
    // handle user registration 
    function RegisterCtrl($scope, $http, $location, $rootScope)
    {
      $rootScope.registermessage = "Please Enter Your Email and Password to Register";

      $scope.register = function(user)
        {
            if(user.password != user.password2 || !user.password || !user.password2)
            {
                $rootScope.registermessage = "Your passwords don't match";
            }
            else
            {
                $http.post("/register", user)
                .success(function(response)
                {
                    // we get the current user object in response
                    if(response != null)
                    {
                        $rootScope.currentUser = response;
                        $location.url("/profile");
                    }
                    $rootScope.registermessage = "Username already taken";
                });
            }
        }
    }
})();
