'use strict';

/**
 * @ngdoc function
 * @name userMonitorApp.controller:SignInCtrl
 * @description
 * # SignInCtrl
 * Controller of the userMonitorApp
 */
angular.module('userMonitorApp')
  .controller('SignInCtrl', function ($scope, $http, $cookies, $window) {
    var init = function () {
      $scope.user = {};
      $scope.error = {};
      $scope.loading = false;
      $scope.processing = false;
      clearErrorMessage();
      clearInput();
    };

    var clearErrorMessage = function () {
      $scope.error.email = '';
      $scope.error.password = '';
      $scope.error.serverError = '';
    };

    var clearInput = function () {
      $scope.user.email = '';
      $scope.user.password = '';
    };

    var isValidInput = function () {
      if (!$scope.user.email) {
        $scope.user.email = '';
        $scope.error.email = 'Email is not valid';
      }
      if (!$scope.user.password) {
        $scope.error.password = 'Password is required';
      }

      if ($scope.error.email || $scope.error.password) {
        return false;
      }

      return true;
    };

    var setCookie = function(data) {
      var now = new Date();
      var expires = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      $cookies.putObject('authData', data, { expires: expires });
    };

    var callHttpRequest = function (data) {
      var credential = btoa(data.email + ":" + data.password);
      var headers = {
        'Content-Type': config.API_CONFIG.headers['Content-Type'],
        'X-DreamFactory-Api-Key': config.API_CONFIG.headers['X-DreamFactory-Api-Key'],
        'Authorization': 'Basic ' + credential
      };

      var httpRequest = {
        method: 'GET',
        url: config.API_USER + '?filter=email=' + data.email,
        headers: headers
       };

      $http(httpRequest).then(function(result) {
        var authData = {
          id: result.data.resource[0].id,
          name: result.data.resource[0].name,
          last_name: result.data.resource[0].last_name,
          first_name: result.data.resource[0].first_name,
          username: result.data.resource[0].username,
          credential: credential
        };
        setCookie(authData);
        clearInput();
        $scope.processing = true;
        $window.location.href = '/';
      }, function(error) {
        $scope.loading = false;
        if (error.data.error.code === 401) {
          $scope.error.serverError = 'Email/Password is not valid'
        } else {
          $scope.error.serverError = 'Login failed ! Internal Server Error';
        }
      });
    };

    var setDataRequest = function() {
      return {
        email: $scope.user.email,
        password: $scope.user.password
      };
    };

   

    // Controller Process
    init();
    $scope.login = function () {
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