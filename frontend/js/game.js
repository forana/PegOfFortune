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
                height: 400,
                wireframes: false,
                background: "#063",
                strokeStyle: "#000",
                strokeWidth: 5
            }
        }
    });

    Matter.Engine.run(engine);

    var letterballs = {};
    var shuffledAlpha = [];
    var rotmod = 0;

    var resetLetters = function() {
        Matter.Engine.clear(engine);

        letterballs = {};
        _.each(alphabet, function(letter) {
            letterballs[letter] = Matter.Bodies.circle(0, 0, 10, {
                isStatic: true,
                label: letter,
                render: {
                    sprite: {
                        texture: "/sprites/" + letter + ".png"
                    }
                }
            });
        });

        shuffledAlpha = _.shuffle(alphabet.split(""));

        var x = 30;
        _.each(letterballs, function(ball) {
            Matter.Body.setPosition(ball, {x: x, y: 50});
            x += 30;
        });

        Matter.World.add(engine.world, _.values(letterballs));
    };

    $scope.handleClick = function(event) {
        var rect = engine.render.element.firstChild.getBoundingClientRect();
        var uxdiff = 494 - (event.clientX - rect.left - 6);
        var xdiff = Math.abs(uxdiff);
        var ydiff = Math.abs(400 - (event.clientY - rect.top - 6));
        var angle = Math.atan(ydiff / xdiff);

        var shooter = Matter.Bodies.circle(494, 400, 10, {
            label: "shooter",
            render: {
                sprite: {
                    texture: "/sprites/shooter.png"
                }
            }
        });
        Matter.Body.setAngle(shooter, 0);
        //Matter.Body.setVelocity(shooter, {x: 20 * Math.cos(angle), y: -20 * Math.sin(angle)});
        Matter.Body.setVelocity(shooter, {x: -20 * Math.cos(angle) * Math.sign(uxdiff), y: -20 * Math.sin(angle)});
        // Matter.Body.applyForce(shooter,
        //     {x: shooter.position.x, y: shooter.position.y},
        //     {x: 5 * Math.cos(angle), y: -5 * Math.sin(angle)}
        // );

        Matter.World.add(engine.world, shooter);
    };

    Matter.Events.on(engine, "collisionStart", function(event) {
        var objs = [event.pairs[0].bodyA, event.pairs[0].bodyB];
        _.each(objs, function (o) {
            if (o.label != "shooter" && letterballs[o.label]) {
                var letter = o.label;
                Matter.World.remove(engine.world, o);
                delete letterballs[letter];

                angular.forEach($scope.puzzle.lines, function (line) {
                    angular.forEach(line, function (c) {
                        if (c.char == letter) {
                            c.revealed = true;
                        }
                    });
                });

                $scope.$apply();
            }
        });
    });

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
