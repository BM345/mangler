
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

        this.roundToNSF = 3;
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
        var text = "\n\nKey and Distractor Formulae: \n\n";

        var j = 1;

        for (var i = 0; i < $scope.mangleGrid.identifiers.length; i++) {
            if ($scope.mangleGrid.identifiers[i] == undefined) {
                continue;
            }
            text += $scope.mangleGrid.identifiers[i] + " = p" + j + "\n";
            j++;
        }

        text += "\n";

        for (var i = 0; i < $scope.mangleGrid.keyFormulae.length; i++) {
            if ($scope.mangleGrid.keyFormulae[i] == "" || $scope.mangleGrid.keyFormulae[i] == undefined) {
                continue;
            }
            text += "p" + j + " = " + $scope.mangleGrid.keyFormulae[i] + "\n";
            j++;
        }

        for (var i = 0; i < $scope.mangleGrid.distractorFormulae.length; i++) {
            if ($scope.mangleGrid.distractorFormulae[i] == "" || $scope.mangleGrid.distractorFormulae[i] == undefined) {
                continue;
            }
            text += "p" + j + " = " + $scope.mangleGrid.distractorFormulae[i] + "\n";
            j++;
        }

        return text;
    }

    $scope.getTableValues = function () {
        var text = "";

        var nqp = $scope.mangleGrid.numberOfQuestionParameters;
        var mnqp = $scope.mangleGrid.maximumNumberOfQuestionParameters;

        var nkp = $scope.mangleGrid.numberOfKeyParameters;
        var mnkp = $scope.mangleGrid.maximumNumberOfKeyParameters;

        var ndp = $scope.mangleGrid.numberOfDistractorParameters;
        var mndp = $scope.mangleGrid.maximumNumberOfDistractorParameters;

        for (var i = 0; i < nqp; i++) {
            for (var j = 0; j < $scope.mangleGrid.numberOfInstances; j++) {
                text += $scope.mangleGrid._grid[i][j] + "\t\t";
            }
            text += "\n";
        }

        for (var i = mnqp; i < mnqp + nkp; i++) {
            for (var j = 0; j < $scope.mangleGrid.numberOfInstances; j++) {
                text += $scope.mangleGrid._grid[i][j].displayValue + "\t\t";
            }
            text += "\n";
        }

        for (var i = mnqp + mnkp; i < mnqp + mnkp + ndp; i++) {
            for (var j = 0; j < $scope.mangleGrid.numberOfInstances; j++) {
                text += $scope.mangleGrid._grid[i][j].displayValue + "\t\t";
            }
            text += "\n";
        }

        return text;
    }

    $scope.updateOutput = function () {

        var mg = $scope.mangleGrid;

        for (var i = 0; i < mg.numberOfInstances; i++) {
            var namesTable = mg.getNamesTableForInstance(i);

            for (var j = 0; j < mg.numberOfKeyParameters; j++) {
                var formula = mg.keyFormulae[j];

                var m = mg.maximumNumberOfQuestionParameters;
                mg._grid[j + m][i] = { displayValue: "", trueValue: "", isDuplicate: false };

                if (isNullOrUndefined(formula)) { continue; }

                try {
                    var a = math.evaluate(formula, namesTable);

                    mg._grid[j + m][i].trueValue = a;

                    if (mg.roundToNSF > 0) {
                        a = a.toPrecision(mg.roundToNSF);
                    }

                    mg._grid[j + m][i].displayValue = a;
                }
                catch{ }
            }

            for (var j = 0; j < mg.numberOfDistractorParameters; j++) {
                var formula = mg.distractorFormulae[j];

                var m = mg.maximumNumberOfQuestionParameters + mg.maximumNumberOfKeyParameters;
                mg._grid[j + m][i] = { displayValue: "", trueValue: "", isDuplicate: false };

                if (isNullOrUndefined(formula)) { continue; }

                try {
                    var a = math.evaluate(formula, namesTable);

                    mg._grid[j + m][i].trueValue = a;

                    if (mg.roundToNSF > 0) {
                        a = a.toPrecision(mg.roundToNSF);
                    }

                    mg._grid[j + m][i].displayValue = a;
                }
                catch{ }
            }

            var m = mg.maximumNumberOfQuestionParameters;
            var n = mg.maximumNumberOfKeyParameters + mg.maximumNumberOfDistractorParameters;

            for (var j = m; j < m + n; j++) {

                var cellJI = mg._grid[j][i];

                if (cellJI == undefined) {
                    continue;
                }

                cellJI.isDuplicate = false;
                cellJI.style = '';

                for (var k = m; k < m + n; k++) {

                    var cellKI = mg._grid[k][i];

                    if (j == k || cellJI == undefined || cellKI == undefined) {
                        continue;
                    }

                    var a = cellJI.displayValue;
                    var b = cellKI.displayValue;

                    if (a == b && a != '' && b != '') {
                        cellJI.isDuplicate = true;
                        cellJI.style = 'background-color: hsla(350, 80%, 80%, 0.3);';
                    }
                }
            }

        }

    }

    $scope.$watch('mangleGrid', function () {

        $scope.ni = $scope.getArrayOfLength($scope.mangleGrid.numberOfInstances);
        $scope.nqp = $scope.getArrayOfLength($scope.mangleGrid.numberOfQuestionParameters);
        $scope.nkp = $scope.getArrayOfLength($scope.mangleGrid.numberOfKeyParameters);
        $scope.ndp = $scope.getArrayOfLength($scope.mangleGrid.numberOfDistractorParameters);

        $scope.updateOutput();
    }, true);

    new ClipboardJS(".copyButton");

}]);