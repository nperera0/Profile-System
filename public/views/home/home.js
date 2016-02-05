(function()
{
    angular
        .module("ProfileApp")
        .controller("HomeController", HomeController);
    // home controller
    function HomeController($scope)
    {
        $scope.hello = "Hello from home controller";
    }
})();
