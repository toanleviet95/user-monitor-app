'use strict';

/**
 * @ngdoc function
 * @name userMonitorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the userMonitorApp
 */
angular.module('userMonitorApp')
  .controller('MainCtrl', function ($scope, $http, $cookies, $window) {
    var authData = null;
    var init = function () {
      authData = $cookies.getObject('authData') || null;
      $scope.user = {};
      $scope.savedUser = {};
      $scope.error = {};
      $scope.isEdit = false;
      $scope.loading = false;
      clearErrorMessage();
      if (authData) {
        clearSavedInput();
      }
    };

    var clearErrorMessage = function () {
      $scope.error.serverError = '';
    };

    var clearSavedInput = function () {
      $scope.savedUser.name = authData.name;
      $scope.savedUser.username = authData.username;
      $scope.savedUser.firstName = authData.first_name;
      $scope.savedUser.lastName = authData.last_name;
    };

    var clearInput = function () {
      $scope.user.name = authData.name;
      $scope.user.username = authData.username;
      $scope.user.firstName = authData.first_name;
      $scope.user.lastName = authData.last_name;
    };

    var setCookie = function(data) {
      var now = new Date();
      var expires = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      $cookies.putObject('authData', data, { expires: expires });
    };

    var callHttpRequest = function (data) {
      var credential = authData.credential;
      var headers = {
        'Content-Type': config.API_CONFIG.headers['Content-Type'],
        'X-DreamFactory-Api-Key': config.API_CONFIG.headers['X-DreamFactory-Api-Key'],
        'Authorization': 'Basic ' + credential
      };

      var httpRequest = {
        method: 'PATCH',
        url: config.API_USER + '?ids=' + authData.id,
        headers: headers,
        data: data
       };
      
      $http(httpRequest).then(function(result) {
        var savedData = {
          id: result.data.resource[0].id,
          name: data.resource[0].name,
          last_name: data.resource[0].last_name,
          first_name: data.resource[0].first_name,
          username: data.resource[0].username,
          credential: credential
        }
        setCookie(savedData);
        $scope.savedUser.name = data.resource[0].name;
        $scope.savedUser.username = data.resource[0].username;
        $scope.savedUser.firstName = data.resource[0].first_name;
        $scope.savedUser.lastName = data.resource[0].last_name;
        $scope.loading = false;
        $scope.isEdit = false;
      }, function(error) {
        $scope.error.serverError = 'Save failed ! Internal Server Error';
      });
    };

    var setDataRequest = function() {
      return {
        resource: [{
          name: $scope.user.name,
          username: $scope.user.username,
          first_name: $scope.user.firstName,
          last_name: $scope.user.lastName
        }]
      };
    };

   // Controller Process
    init();
    $scope.goToEdit = function() {
      authData = $cookies.getObject('authData') || null;
      $scope.isEdit = true;
      clearInput();
    };

    $scope.goToBack = function() {
      $scope.isEdit = false;
    };

    $scope.save = function() {
      clearErrorMessage();
      $scope.loading = true;
      var data = setDataRequest();
      callHttpRequest(data);
    };

    $scope.logout = function() {
      $cookies.remove('authData');
      $window.location.href = '/';
    };
  });
