'use strict';

/**
 * @ngdoc function
 * @name gremlinConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gremlinConsoleApp
 */
angular.module('gremlinConsoleApp')
  .controller('MainCtrl', function ($scope, $log) {
    $scope.results = [];

    $scope.client = null;

    $scope.host = null;
    $scope.port = null;
    $scope.gridOptions = { data: 'results'};
    $scope.connectionStatus = 'Connect';
    $scope.buttonClass = '';

    $scope.connect = function() {
        $scope.client = gremlin.createClient($scope.port, $scope.host);
        $scope.connectionStatus = 'Connected';
        $scope.buttonClass = 'disabled';
    };

    $scope.query = function() {
        $scope.client.on('open', function() {
            $log.info('Connection to Gremlin Server established!');
        });

        
        var query = $scope.client.stream($scope.script);

        query.on('data', function(d) {
            $scope.$apply(function () {
               $scope.results.push(d); 
            });
        });

        query.on('end', function(d) {
            $log.info('All results fetched');
        });

        query.on('error', function(e) {
            $log.info('Could not complete query:', e.message);
        });        
    }

    $scope.aceLoaded = function(_editor) {
        var _session = _editor.getSession().setMode("ace/mode/groovy");
    }
  });
