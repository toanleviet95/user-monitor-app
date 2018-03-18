'use strict';

/**
 * @ngdoc overview
 * @name userMonitorApp
 * @description
 * # userMonitorAppApp
 *
 * Main module of the application.
 */
angular
  .module('userMonitorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(router)
  .run(authGuard);

router.$inject = ['$routeProvider'];

function router($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/sign-in', {
      templateUrl: 'views/sign-in.html',
      controller: 'SignInCtrl',
      controllerAs: 'sign-in'
    })
    .when('/sign-up', {
      templateUrl: 'views/sign-up.html',
      controller: 'SignUpCtrl',
      controllerAs: 'sign-up'
    })
    .otherwise({
      redirectTo: '/'
    });
};

authGuard.$inject = ['$rootScope', '$location', '$cookies', '$http'];

function authGuard($rootScope, $location, $cookies, $http) {
  var loggedIn = $cookies.getObject('authData') || null;
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var location = $location.path();
    if (!loggedIn) {
      if (location.indexOf('sign-up') !== -1) {
        $location.path('/sign-up');
      } else {
        $location.path('/sign-in');
      }
    } else {
      $location.path('/');
    }
  });
  $rootScope.$on('$stateChangeStart', function () {
    $rootScope.stateIsLoading = true;
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    $rootScope.stateIsLoading = false;
  });
}
