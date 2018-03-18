'use strict';

/**
 * @ngdoc function
 * @name userMonitorApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the userMonitorApp
 */
angular.module('userMonitorApp')
  .controller('SignUpCtrl', function ($scope, $http) {
    var init = function () {
      $scope.user = {};
      $scope.error = {};
      $scope.loading = false;
      clearErrorMessage();
      clearInput();
    };

    var clearErrorMessage = function () {
      $scope.success = '';
      $scope.error.email = '';
      $scope.error.password = '';
      $scope.error.confirmPassword = '';
      $scope.error.serverError = '';
    };

    var clearInput = function () {
      $scope.user.name = '';
      $scope.user.firstName = '';
      $scope.user.lastName = '';
      $scope.user.email = '';
      $scope.user.password = '';
      $scope.confirmPassword = '';
    };

    var isValidInput = function () {
      if (!$scope.user.email) {
        $scope.user.email = '';
        $scope.error.email = 'Email is not valid';
      }
      if (!$scope.user.password) {
        $scope.error.password = 'Password is required';
      } else if($scope.user.password.length < 6) {
        $scope.error.password = 'Password must be more than 5 characters';
      } else {
        if ($scope.user.password !== $scope.confirmPassword) {
          $scope.error.confirmPassword = 'Not correct ! You must type to confirm password again';
        }
      }

      if ($scope.error.email || $scope.error.password || $scope.error.confirmPassword) {
        return false;
      }

      return true;
    };

    var callHttpRequest = function (data) {
      var httpRequest = {
        method: 'POST',
        url: config.API_USER,
        headers: config.API_CONFIG.headers,
        data: data
       };

      $http(httpRequest).then(function(result) {
        clearInput();
        $scope.loading = false;
        $scope.success = 'Signed up successfully !';
      }, function(error) {
        $scope.loading = false;
        if (error.data.error.code === 1000) {
          $scope.error.email = 'This email has been signed up ! Try again with other email'
        } else {
          $scope.error.serverError = 'Signed up failed ! Internal Server Error';
        }
      });
    };

    var setDataRequest = function() {
      return {
        resource: [{
          name: $scope.user.name,
          first_name: $scope.user.firstName,
          last_name: $scope.user.lastName,
          email: $scope.user.email,
          password: $scope.user.password
        }]
      };
    };

    // Controller Process
    init();
    $scope.register = function () {
      clearErrorMessage();
      var valid = isValidInput();
      if (!valid) {
        return false;
      }

      $scope.loading = true;
      var data = setDataRequest();
      callHttpRequest(data);
    };
  });
