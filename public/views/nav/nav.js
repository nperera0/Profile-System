(function()
{
    angular
        .module("ProfileApp")
        .controller("NavCtrl", NavCtrl);
    //navigation controller 
    function NavCtrl($scope, $http, $location, $rootScope)
    {
        $scope.logout = function()
        {
            $http.post("/logout")
            .success(function()
            {
                $rootScope.currentUser = null;
                $location.url("/home");
            });
        }
    }
})();
