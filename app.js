var app = angular.module("Mangler", []);

function isEmpty(o) {
    return Object.keys(o).length === 0;
}

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

    $scope.keysOutput = [];
    $scope.distractorsOutput = [];

    for (var i = 0; i < 5; i++) {
        $scope.keysOutput.push(new Array(10));
        $scope.distractorsOutput.push(new Array(10));
    }

    $scope.getArrayOfLength = function (n) {
        return new Array(n);
    }

    $scope.getNotesText = function () {
        var text = "Key and Distractor Formulae: \n\n";

        for (var i = 0; i < $scope.keyFormulae.length; i++) {
            if ($scope.keyFormulae[i] == "" || $scope.keyFormulae[i] == undefined) {
                continue;
            }
            text += "k" + (i + 1) + " = " + $scope.keyFormulae[i] + "\n";
        }

        for (var i = 0; i < $scope.distractorFormulae.length; i++) {
            if ($scope.distractorFormulae[i] == "" || $scope.distractorFormulae[i] == undefined) {
                continue;
            }
            text += "d" + (i + 1) + " = " + $scope.distractorFormulae[i] + "\n";
        }

        return text;
    }

    $scope.updateOutput = function () {

        for (var i = 0; i < $scope.numberOfInstances; i++) {
            console.log("Instance " + (i + 1));

            var namesTable = {};

            console.log($scope.identifiers);

            for (var j = 0; j < $scope.identifiers.length; j++) {
                var parameterIdentifier = $scope.identifiers[j];
                var parameterValue = $scope.parameters[i][j];

                if (parameterIdentifier == "" || parameterIdentifier == undefined || parameterValue == "" || parameterValue == undefined) {
                    continue;
                }

                namesTable[parameterIdentifier] = parameterValue;
            }

            if (isEmpty(namesTable)) {
                continue;
            }

            console.log(namesTable);

            for (var j = 0; j < $scope.numberOfKeys; j++) {
                var formula = $scope.keyFormulae[j];

                $scope.keysOutput[i][j] = "";

                if (formula == "" || formula == undefined) {
                    continue;
                }

                var js = formula;

                for (var name in namesTable) {
                    js = js.replace(name, namesTable[name]);
                }

                console.log(js);

                try {
                    $scope.keysOutput[i][j] = eval(js);
                }
                catch{ }
            }

            for (var j = 0; j < $scope.numberOfDistractors; j++) {
                var formula = $scope.distractorFormulae[j];

                $scope.distractorsOutput[i][j] = "";

                if (formula == "" || formula == undefined) {
                    continue;
                }

                var js = formula;

                for (var name in namesTable) {
                    js = js.replace(name, namesTable[name]);
                }

                console.log(js);

                try {
                    $scope.distractorsOutput[i][j] = eval(js);
                }
                catch{ }
            }
        }

    }

    $scope.$watch('identifiers', function () {
        $scope.updateOutput();
    }, true);

    $scope.$watch('keyFormulae', function () {
        $scope.updateOutput();
    }, true);

    $scope.$watch('distractorFormulae', function () {
        $scope.updateOutput();
    }, true);

    $scope.$watch('parameters', function () {
        $scope.updateOutput();
    }, true);

    new ClipboardJS(".copyButton");

}]);