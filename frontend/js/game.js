var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var isAlpha = function(c) {
    return alphabet.includes(c)
}

angular.module("GameApp", [])
.controller("GameController", function($scope, $http) {
    $scope.puzzle = {
        category: "LOADING",
        lines: []
    };

    $scope.loadPuzzle = function() {
        $http.get("/puzzle")
        .then(function(response) {
            processPuzzle(response.data);
            resetLetters();
        }, function(error) {
            alert(error);
        });
    };

    var processPuzzle = function(rawPuzzle) {
        $scope.puzzle = {
            category: rawPuzzle.category.toUpperCase(),
            lines: []
        };
        angular.forEach(rawPuzzle.solution.split("\n"), function(line) {
            var newLine = [];
            angular.forEach(line.toUpperCase(), function(c) {
                newLine.push({
                    char: c,
                    revealed: !isAlpha(c)
                });
            });
            $scope.puzzle.lines.push(newLine);
        });
    };

    $scope.loadPuzzle();

    var engine = Matter.Engine.create({
        render: {
            element: document.getElementById("graphics"),
            options: {
                width: 988,
                height: 400
            }
        }
    });
    var mouseInput = Matter.Mouse.create(engine.render.element);

    Matter.Engine.run(engine);

    var letterballs = {};
    var shuffledAlpha = [];
    var rotmod = 0;

    var resetLetters = function() {
        Matter.Engine.clear(engine);

        letterballs = {};
        _.each(alphabet, function(letter) {
            letterballs[letter] = Matter.Bodies.circle(0, 0, 10, {isStatic: true});
        });

        shuffledAlpha = _.shuffle(alphabet.split(""));

        var x = 30;
        _.each(letterballs, function(ball) {
            Matter.Body.setPosition(ball, {x: x, y: 50});
            x += 30;
        });

        Matter.World.add(engine.world, _.values(letterballs));
    };

    setInterval(function() {
        var r = rotmod;
        _.each(shuffledAlpha, function(letter) {
            if (letterballs[letter]) {
                var deg = r / 180 * Math.PI;
                Matter.Body.setPosition(letterballs[letter], {
                    x: 494 - (100 * Math.cos(deg)),
                    y: 150 + (100 * Math.sin(deg))
                });
            }
            r += 360/26;
        });
        rotmod += 1;
    }, 1000 / 30);
});
