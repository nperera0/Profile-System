(function()
{
  angular
    .module("ProfileApp")
    .controller("AdminController", AdminController);
  // admin controller 
  function AdminController($scope, $http, $location, $rootScope)
  {
    $http.get("/rest/user")
    .success(function(users)
    {
        $scope.users = users;
    });

    $scope.remove = function(user)
    {
        $http.delete('/rest/user/'+user._id)
        .success(function(users){
           $scope.users = users;
           $location.url("/viewprofiles");
        });
    }

    $scope.update = function(user)
    {
        $http.put('/rest/user/'+user._id, user)
        .success(function(users){
            $scope.users = users;
            $location.url("/detailviewprofile");
        });
    }

    $scope.asadmin = function(user) // asign admin
    {
        // get rid of 'user' status
        var index = user.roles.indexOf('user');
        if(index > -1){
          user.roles.splice(index, 1);
        }
        // promote to 'admin' status
        user.roles.push('admin');
        $http.put('/rest/user/'+user._id, user)
        .success(function(users){
            $scope.users = users;
        });
    }

    $scope.usadmin = function(user)//un asign admin
    {
        // get rid of 'admin' status
        var index = user.roles.indexOf('admin');
        if(index > -1){
        // set 'user' status
        user.roles.push('user');
        user.roles.splice(index, 1);
        $http.put('/rest/user/'+user._id, user)
        .success(function(users){
            $scope.users = users;
        });
      }
        $location.url("/detailviewprofile");
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
      $location.url("/editDetailprofile");
    }

    $scope.add = function(user)
    {
        $http.post('/rest/user', user)
        .success(function(users){
            $scope.users = users;
        });
    }

    $scope.select = function(user)
    {
        $scope.user = user;
    }

    $scope.viewprofile = function(user)
    {
      $http.get('/rest/user/'+user._id, user)
      .success(function(user){
          // keep track of pages viewed
          $rootScope.currentUser.history.push(user.username);
          $http.put('/rest/user/'+$rootScope.currentUser._id, $rootScope.currentUser)

          // save the user to view in detail and redirect to detail view
          $rootScope.detailuser = user;
          $location.url("/detailviewprofile");
      });
    }

    $scope.cancel = function()
    {
      $location.url("/detailviewprofile");
    }

    $scope.arrayToString = function(string){
      return string.join(", ");
    };

  }
})();
