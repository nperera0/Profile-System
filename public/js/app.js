(function()
{
    angular.module("ProfileApp", ["ngRoute"]);

    // here we handle all the routing and
    //checkAdmin,checkCurrentUser,checkLoggedin functions 
    angular.module("ProfileApp")
        .config(function($routeProvider, $httpProvider) {
            $routeProvider
              .when('/home', {
                  templateUrl: 'views/home/home.html',
                  controller: 'HomeController',
                  resolve: {
                      loggedin: checkCurrentUser
                  }
              })
              .when('/editprofile', {
                  templateUrl: 'views/profile/editProfile.html',
                  controller: 'ProfileCtrl',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/profile', {
                  templateUrl: 'views/profile/userProfile.html',
                  controller: 'ProfileCtrl',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/editDetailprofile', {
                  templateUrl: 'views/admin/adminEditProfile.html',
                  controller: 'AdminController',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/viewprofiles', {
                  templateUrl: 'views/admin/userProfileList.html',
                  controller: 'AdminController',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/detailviewprofile', {
                  templateUrl: 'views/admin/detailProfile.html',
                  controller: 'AdminController',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/admin', {
                  templateUrl: 'views/admin/admin.html',
                  controller: 'AdminController',
                  resolve: {
                      loggedin: checkAdmin
                  }
              })
              .when('/login', {
                  templateUrl: 'views/login/login.html',
                  controller: 'LoginCtrl'
              })
              .when('/register', {
                  templateUrl: 'views/register/register.html',
                  controller: 'RegisterCtrl'
              })
              .otherwise({
                  redirectTo: '/home'
              });
        });

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0' && user.roles.indexOf('admin') != -1)
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
        });

        return deferred.promise;
    };


    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/home');
            }
        });

        return deferred.promise;
    };

    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
            }
            deferred.resolve();
        });

        return deferred.promise;
    };


})();
