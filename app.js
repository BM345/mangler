var app = angular.module("Mangler", []);

app.controller("MainController", ["$scope", function MainController($scope) {

    $scope.numberOfInstances = 5;
    $scope.numberOfParameters = 2;
    $scope.numberOfKeys = 1;
    $scope.numberOfDistractors = 4;

    $scope.identifiers = new Array(40);
    $scope.keyFormulae = new Array(5);
    $scope.distractorFormulae = new Array(5);
    $scope.parameters = [];

    for (var i = 0; i < 40; i++) {
        $scope.parameters.push(new Array(10));
    }

    $scope.getArrayOfLength = function (n) {
        return new Array(n);
    }

    $scope.updateOutput = function () {

        for (var i = 0; i < $scope.numberOfInstances; i++){
            var namesTable = {};

            for (var j = 0; j < $scope.identifiers.length; j++){
                namesTable[$scope.identifiers[j]] = $scope.parameters[i][j];
            }
        }

    }

    $scope.$watch('identifiers', function () {
        $scope.updateOutput();
    });

    $scope.$watch('keyFormulae', function () {
        $scope.updateOutput();
    });

    $scope.$watch('distractorFormulae', function () {
        $scope.updateOutput();
    });

    $scope.$watch('parameters', function () {
        $scope.updateOutput();
    });

}]);