var app = angular.module("Mangler", []);

function isNullOrUndefined(a) {
    return (a === "" || a === undefined || a === null);
}

function isEmpty(o) {
    return Object.keys(o).length === 0;
}

class MangleGrid {
    constructor() {
        this.numberOfInstances = 5;
        this.numberOfQuestionParameters = 2;
        this.numberOfKeyParameters = 1;
        this.numberOfDistractorParameters = 4;

        this.maximumNumberOfInstances = 10;
        this.maximumNumberOfQuestionParameters = 20;
        this.maximumNumberOfKeyParameters = 20;
        this.maximumNumberOfDistractorParameters = 20;

        this.identifiers = new Array(this.maximumNumberOfQuestionParameters);
        this.keyFormulae = new Array(this.maximumNumberOfKeyParameters);
        this.distractorFormulae = new Array(this.maximumNumberOfDistractorParameters);

        this._grid = [];

        for (var i = 0; i < this.height; i++) {
            this._grid.push(new Array(this.width));
        }
    }

    get width() {
        return this.maximumNumberOfInstances;
    }

    get height() {
        return this.maximumNumberOfQuestionParameters + this.maximumNumberOfKeyParameters + this.maximumNumberOfDistractorParameters;
    }

    get questionInputs() {
        return this._grid.slice(0, this.maximumNumberOfQuestionParameters);
    }

    get keysOutput() {
        return this._grid.slice(this.maximumNumberOfQuestionParameters, this.maximumNumberOfKeyParameters);
    }

    get distractorsOutput() {
        return this._grid.slice(this.maximumNumberOfKeyParameters, this.maximumNumberOfDistractorParameters);
    }

    getNamesTableForInstance(instance) {
        var namesTable = {};

        for (var j = 0; j < this.identifiers.length; j++) {
            var identifier = this.identifiers[j];
            var value = this._grid[j][instance];

            if (isNullOrUndefined(identifier) || isNullOrUndefined(value)) {
                continue;
            }

            namesTable[identifier] = value;
        }

        return namesTable;
    }
}

app.controller("MainController", ["$scope", function MainController($scope) {

    $scope.mangleGrid = new MangleGrid();

    $scope.getArrayOfLength = function (n) {
        return new Array(n);
    }

    $scope.ni = $scope.getArrayOfLength($scope.mangleGrid.numberOfInstances);
    $scope.nqp = $scope.getArrayOfLength($scope.mangleGrid.numberOfQuestionParameters);
    $scope.nkp = $scope.getArrayOfLength($scope.mangleGrid.numberOfKeyParameters);
    $scope.ndp = $scope.getArrayOfLength($scope.mangleGrid.numberOfDistractorParameters);

    $scope.getNotesText = function () {
        var text = "Key and Distractor Formulae: \n\n";

        for (var i = 0; i < $scope.mangleGrid.keyFormulae.length; i++) {
            if ($scope.mangleGrid.keyFormulae[i] == "" || $scope.mangleGrid.keyFormulae[i] == undefined) {
                continue;
            }
            text += "k" + (i + 1) + " = " + $scope.mangleGrid.keyFormulae[i] + "\n";
        }

        for (var i = 0; i < $scope.mangleGrid.distractorFormulae.length; i++) {
            if ($scope.mangleGrid.distractorFormulae[i] == "" || $scope.mangleGrid.distractorFormulae[i] == undefined) {
                continue;
            }
            text += "d" + (i + 1) + " = " + $scope.mangleGrid.distractorFormulae[i] + "\n";
        }

        return text;
    }

    $scope.updateOutput = function () {

        for (var i = 0; i < $scope.mangleGrid.numberOfInstances; i++) {
            var namesTable = $scope.mangleGrid.getNamesTableForInstance(i);

            if (isEmpty(namesTable)) { continue; }

              console.log(namesTable);

            for (var j = 0; j < $scope.mangleGrid.numberOfKeys; j++) {
                var formula = $scope.mangleGrid.keyFormulae[j];

                $scope.mangleGrid.keysOutput[i][j] = "";

                if (isNullOrUndefined(formula)) { continue; }

                var js = formula;

                for (var name in namesTable) {
                    js = js.replace(name, namesTable[name]);
                }

                try {
                    $scope.mangleGrid.keysOutput[i][j] = eval(js);
                }
                catch{ }
            }

            for (var j = 0; j < $scope.mangleGrid.numberOfDistractors; j++) {
                var formula = $scope.mangleGrid.distractorFormulae[j];

                $scope.mangleGrid.distractorsOutput[i][j] = "";

                if (isNullOrUndefined(formula)) { continue; }

                var js = formula;

                for (var name in namesTable) {
                    js = js.replace(name, namesTable[name]);
                }

                try {
                    $scope.mangleGrid.distractorsOutput[i][j] = eval(js);
                }
                catch{ }
            }
        }

    }

    $scope.$watch('mangleGrid', function () {
        $scope.updateOutput();
    }, true);

    new ClipboardJS(".copyButton");

}]);