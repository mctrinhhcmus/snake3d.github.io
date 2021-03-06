// game.js

if (/Mobi/.test(navigator.userAgent) && location.pathname != "/touch.html") {
    location.replace("/touch.html");
}

var camera, scene, renderer, container, eingabe, canvasDown, currentCanvasRow, currentCanvasCol, ctx, c, difficulty,
    score, fruit, beginningBlockNumber, gameLost, direction, doUpdatem, geometry, material, material2, materialsnake,
    materialsnakehead, geometrysnake, texturesnake, texturesnakehead, edges, edges2, edges3, edges4, mesh, meshes,
    geometry2, material2, mesh2, geometry3, material3, mesh3, geometry4, material4, mesh4, texture, helper, controls,
    OrbitControls, sun, camerasettings, camerasettings2, textureFruit, nameFruit;

var cameramode = "ThirdPerson";
var fruitItems = ["fruit1.jpg", "fruit2.jpg", "fruit3.jpg", "fruit4.jpg", "fruit5.jpg", "fruit6.jpg"];
var solarItenms = ["solar0.jpg", "solar1.jpg", "solar2.jpg", "solar3.jpg", "solar4.jpg", "solar5.jpg", "solar6.jpg", "solar7.jpg", "solar8.jpg", "solar9.jpg  "];


$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify
    // the modal ID that wants to be triggered
    $('.modal').modal();

    meshes = [];
    doUpdate = true;
    direction = "u";
    gameLost = -1;
    beginningBlockNumber = 3;
    //cHeight ;//offset 0.3? 0.5?
    fruit = [];
    score = 0;
    difficulty = "MEDIUM";
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    currentCanvasCol = 10;
    currentCanvasRow = 190;
    canvasDown = true;
    eingabe = true;

    container = document.getElementById("Spiel");

    //alert("This page is in beta-testing and not related to other dibaku.
    // de contents or services! Many functions are not implemented and not every bug is fixed yet.");

    //For smartphones:
    if (/Mobi/.test(navigator.userAgent)) {
        $(window).on("orientationchange", function (event) {
            if (innerWidth > innerHeight) { //PORTRAIT
                $('#modal5').modal('close');
                $('#modal4').modal('open');
            } else { //LANDSCAPE
                $('#modal4').modal('close');
                $('#modal5').modal('open');
            }
        });
    }

    init();
    animate();
});


function init() {

    document.addEventListener("keydown", onDocumentKeyDown, false);

    camera = new THREE.TargetCamera(70, 1, 0.01, 10);

    scene = new THREE.Scene();

    //Skybox
    // materialSB = new THREE.MeshNormalMaterial();
    texture = new THREE.TextureLoader().load('seamless_space.png');
    materialSB = new THREE.MeshBasicMaterial({map: texture});

    sky = new THREE.BoxGeometry(0.1, 18, 18);
    skybox = new THREE.Mesh(sky, materialSB);
    skybox.position.x = -6;
    skybox.position.z = 0.1;

    sky2 = new THREE.BoxGeometry(0.1, 18, 18);
    skybox2 = new THREE.Mesh(sky2, materialSB);
    skybox2.position.x = 6;
    skybox2.position.z = 0.1;

    sky3 = new THREE.BoxGeometry(18, 0.1, 18);
    skybox3 = new THREE.Mesh(sky3, materialSB);
    skybox3.position.y = -6;
    skybox3.position.z = 0.1;

    sky4 = new THREE.BoxGeometry(18, 0.1, 18);
    skybox4 = new THREE.Mesh(sky4, materialSB);
    skybox4.position.y = 6;
    skybox4.position.z = 0.1;

    sky5 = new THREE.BoxGeometry(18, 18, 0.1);
    skybox5 = new THREE.Mesh(sky5, materialSB);
    skybox5.position.y = 0;
    skybox5.position.z = -6;

    // Solar system
    var nameSolar = solarItenms[Math.floor(Math.random() * solarItenms.length)];
    var loader = new THREE.TextureLoader();
    loader.load(nameSolar,
        function (texture) {
            var geometry = new THREE.SphereGeometry(4, 40, 40);
            var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
            sun = new THREE.Mesh(geometry, material);
            sun.position.z = -4.5;
            scene.add(sun);
            sun.rotation.x += -0.00045;
            sun.rotation.y += 0.0009;
        });

    scene.add(skybox);
    scene.add(skybox2);
    scene.add(skybox3);
    scene.add(skybox4);
    scene.add(skybox5);

    // texture = new THREE.TextureLoader().load('bricks2.jpg');

    geometry = new THREE.BoxGeometry(3.51, 0.1, 0.28);

    material = new THREE.MeshBasicMaterial({color: 0xff9000});
    material2 = new THREE.MeshBasicMaterial({color: 0xff6100});

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.755;
    mesh.position.x = 0.05;

    geometry2 = new THREE.BoxGeometry(3.51, 0.1, 0.28);
    mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.y = -1.655;
    mesh2.position.x = 0.05;

    geometry3 = new THREE.BoxGeometry(0.1, 3.51, 0.28);
    mesh3 = new THREE.Mesh(geometry3, material2);
    mesh3.position.x = 1.755;
    mesh3.position.y = 0.05;

    geometry4 = new THREE.BoxGeometry(0.1, 3.51, 0.28);
    mesh4 = new THREE.Mesh(geometry4, material2);
    mesh4.position.x = -1.655;
    mesh4.position.y = 0.05;

    edges = new THREE.EdgesHelper(mesh, 0x000000);
    edges.material.linewidth = 1;
    edges.position.x = 0.05;
    edges.position.y = 1.755;

    edges2 = new THREE.EdgesHelper(mesh2, 0x000000);
    edges2.material.linewidth = 1;
    edges2.position.x = 0.05;
    edges2.position.y = -1.655;

    edges3 = new THREE.EdgesHelper(mesh3, 0x000000);
    edges3.material.linewidth = 1;
    edges3.position.x = 1.755;
    edges3.position.y = 0.05;

    edges4 = new THREE.EdgesHelper(mesh4, 0x000000);
    edges4.material.linewidth = 1;
    edges4.position.x = -1.655;
    edges4.position.y = 0.05;

    // create a wall around
    scene.add(mesh);
    scene.add(mesh2);
    scene.add(mesh3);
    scene.add(mesh4);
    scene.add(edges);
    scene.add(edges2);
    scene.add(edges3);
    scene.add(edges4);

    // create snake
    geometrysnake = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    texturesnake = new THREE.TextureLoader().load('schlange.jpg');
    texturesnakehead = new THREE.TextureLoader().load('kopf.jpg');
    materialsnake = new THREE.MeshBasicMaterial({map: texturesnake});
    materialsnakehead = new THREE.MeshBasicMaterial({map: texturesnakehead});

    for (var i = 0; i < beginningBlockNumber; i++) {
        if (i == 0) {
            meshes[i] = new THREE.Mesh(geometrysnake, materialsnakehead);
        } else {
            meshes[i] = new THREE.Mesh(geometrysnake, materialsnake);
        }
        scene.add(meshes[i]);
        meshes[i].position.x = -i * 0.11;

    }

    //Erstellen des Target

    camerasettings = {
        name: 'myTarget',
        targetObject: meshes[0],
        cameraRotation: new THREE.Euler(-Math.PI / 4 + 0.1, 0, 0),
        cameraPosition: new THREE.Vector3(0, 0, 0.45),
        fixed: false,
        stiffness: 0.08,
        matchRotation: true,
    }

    camerasettings2 = {
        name: 'myTarget2',
        targetObject: meshes[0],
        cameraRotation: new THREE.Euler(0, 0, 0),
        cameraPosition: new THREE.Vector3(0, 0, 0),
        fixed: false,
        stiffness: 0.1,
        matchRotation: true,
    }

    camera.addTarget(camerasettings);
    camera.setTarget('myTarget');
    meshes[0].rotation.x = Math.PI / 2;

    // create chessboard
    helper = new THREE.GridHelper(3.31, 30, 0x444444, 0x888888);
    helper.position.x = 0.05;
    helper.position.y = 0.05;
    helper.position.z = -0.055;
    helper.material.opacity = 100;
    helper.material.transparent = true;
    helper.rotation.x = Math.PI / 2;
    helper.rotation.y = 0;
    scene.add(helper);

    genFruits();

    renderer = new THREE.WebGLRenderer({antialias: true});
    let size = Math.min(container.offsetHeight, container.offsetWidth);
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    renderer.render(scene, camera);
    canvasInit();
}

function canvasInit() {

    c.width = Math.max(screen.width, screen.height);
    c.height = Math.min(screen.width, screen.height) - 40;

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(10, 10, 50, 50);
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(10, 70, 50, 50);
    ctx.fillRect(10, 130, 50, 50);
}

function canvasRefresh() {
    ctx.fillStyle = "#00FF00";
    if (currentCanvasRow + 50 > c.height) {
        currentCanvasRow -= 60;
        currentCanvasCol += 60;
        canvasDown = !canvasDown;
    } else if (currentCanvasRow < 10) {
        //alert("ende");
        currentCanvasCol += 60;
        canvasDown = !canvasDown;
        currentCanvasRow += 60;
    }
    if (currentCanvasCol < Math.max(screen.width, screen.height) / 3) {
        ctx.fillRect(currentCanvasCol, currentCanvasRow, 50, 50);
        if (canvasDown) {
            currentCanvasRow += 60;
        } else {
            currentCanvasRow -= 60;
        }
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function goFullScreen() {
    enterFullscreen(document.getElementById("Spiel"));
    //alert(innerWidth + "  " + innerHeight);
    setTimeout(function () {
        document.getElementById("div_guiLeft").style.display = "block";
        document.getElementById("div_guiRigth").style.display = "block";
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);

        window.onclick = function (e) {

            if (eingabe === false) {

                if (e.screenX < innerWidth / 2) {
                    meshes[0].rotation.y += Math.PI / 2;
                    if (direction == "u") {
                        direction = "l";
                    } else if (direction == "d") {
                        direction = "r";
                    } else if (direction == "l") {
                        direction = "d";
                    } else if (direction == "r") {
                        direction = "u";
                    }
                    eingabe = true;
                } else {
                    meshes[0].rotation.y -= Math.PI / 2;
                    if (direction == "u") {
                        direction = "r";
                    } else if (direction == "d") {
                        direction = "l";
                    } else if (direction == "l") {
                        direction = "u";
                    } else if (direction == "r") {
                        direction = "d";
                    }
                    eingabe = true;
                }
            }
        };

    }, 1000);
}

function leaveFullscreen() {
    exitFullscreen();
    //alert(innerWidth + "  " + innerHeight);
    setTimeout(function () {
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        let size = Math.min(container.offsetHeight, container.offsetWidth);
        renderer.setSize(size, size);
    }, 1000);
}

function startGameLoop() {
    if (/Mobi/.test(navigator.userAgent) && innerWidth < innerHeight) {
        $('#modal4').modal('open');
    } else {
        $('#modal5').modal('close');
        direction = "u";
        meshes[0].rotation.y = 0;

        if (difficulty == "EASY") {
            diff = 350;
        } else if (difficulty == "MEDIUM") {
            diff = 200;
        } else if (difficulty == "HARD") {
            diff = 90;
        } else {
            diff = 200;
        }

        setInterval(function () {
            doUpdate = true;
        }, diff);
        goFullScreen();
    }
}

function setDifficulty(diff) {
    difficulty = diff;
    var lbl_gui = document.getElementById("lbl_gui");
    lbl_gui.innerHTML = lbl_gui.innerHTML = "SCORE: " + score + "<br>DIFFICULTY: " + difficulty;
}

function setModus(mode) {
    cameramode = mode;

    if (cameramode === "FirstPerson") {
        camera.addTarget(camerasettings2);
        camera.setTarget('myTarget2');
        scene.remove(meshes[0]);
    } else {
        camera.addTarget(camerasettings);
        camera.setTarget('myTarget');
        scene.add(meshes[0]);
    }
}

function genFruits() {
    for (var z = fruit.length; z < 5; z++) {
        nameFruit = fruitItems[Math.floor(Math.random() * fruitItems.length)];
        textureFruit = new THREE.TextureLoader().load(nameFruit);
        geometryfruit = new THREE.SphereGeometry(0.05, 32, 32);
        materialfruit = new THREE.MeshBasicMaterial({map: textureFruit});
        fruit[z] = new THREE.Mesh(geometryfruit, materialfruit);
        fruit[z].position.x = THREE.Math.randInt(1, 30) * 0.11 - 1.6505;
        fruit[z].position.y = THREE.Math.randInt(1, 30) * 0.11 - 1.6505;
        scene.add(fruit[z]);
    }
}

function takeBodyParts() {
    for (var i = meshes.length - 1; i > 0; i--) {
        meshes[i].position.x = meshes[i - 1].position.x;
        meshes[i].position.y = meshes[i - 1].position.y;
    }
}

function right() {
    console.log("GO RIGHT");

    takeBodyParts();

    meshes[0].position.x += 0.11;
}

function left() {
    console.log("GO LEFT");

    takeBodyParts();

    meshes[0].position.x -= 0.11;
}

function up() {
    console.log("GO UP");

    takeBodyParts();

    meshes[0].position.y += 0.11;
}

function down() {
    console.log("GO DOWN");

    takeBodyParts();

    meshes[0].position.y -= 0.11;
}

function addOneBlock() {

    incrementScore();
    meshes[meshes.length] = new THREE.Mesh(geometrysnake, materialsnake);
    scene.add(meshes[meshes.length - 1]);
    meshes[meshes.length - 1].position.x = meshes[meshes.length - 2].position.x;
    meshes[meshes.length - 1].position.y = meshes[meshes.length - 2].position.y;
}

function incrementScore() {
    // score += 100;
    score += 1;
    canvasRefresh();
    var lbl_fsGUI = document.getElementById("lbl_fsGUI");
    // lbl_fsGUI.innerHTML = "<b>SCORE:<br>" + score + "<br>LENGTH:<br>" + (score / 100 + 3) + "</b>";
    lbl_fsGUI.innerHTML = "<b>SCORE:<br>" + score + "<br>LENGTH:<br>" + (score + 3) + "</b>";
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    //alert(keyCode);
    if (eingabe === false) {
        if (keyCode == 37) { //LEFT
            meshes[0].rotation.y += Math.PI / 2;
            if (direction == "u") {
                direction = "l";
            } else if (direction == "d") {
                direction = "r";
            } else if (direction == "l") {
                direction = "d";
            } else if (direction == "r") {
                direction = "u";
            }
            eingabe = true;

        } else if (keyCode == 39) { //RIGHT
            meshes[0].rotation.y -= Math.PI / 2;
            if (direction == "u") {
                direction = "r";
            } else if (direction == "d") {
                direction = "l";
            } else if (direction == "l") {
                direction = "u";
            } else if (direction == "r") {
                direction = "d";
            }
            eingabe = true;

        } else if (keyCode == 32) {
            startGameLoop();
        }
    }
}

function animate() {

    requestAnimationFrame(animate);

    sun.rotation.x += -0.00045;
    sun.rotation.y += 0.0009;

    if (doUpdate) {

        if (gameLost !== -1) {
            if (gameLost < meshes.length) {
                if (gameLost == 0) {
                    var lbl_lostScore = document.getElementById("lbl_lostScore");
                    lbl_lostScore.innerHTML = score;
                    leaveFullscreen();
                    $('#modal3').modal('open');
                }
                scene.remove(meshes[gameLost]);
                gameLost++;

            } else {

            }
        } else {

            for (var z1 = 0; z1 <= 4; z1++) {
                var firstBB = new THREE.Box3().setFromObject(meshes[0]);
                var secondBB = new THREE.Box3().setFromObject(fruit[z1]);
                // var collision = firstBB.isIntersectionBox(secondBB);
                if (firstBB.isIntersectionBox(secondBB)) {
                    addOneBlock();
                    scene.remove(fruit[z1]);
                    fruit.splice(z1, 1);
                    genFruits();
                }
            }

            var headBB = new THREE.Box3().setFromObject(meshes[0]);
            var northBB = new THREE.Box3().setFromObject(mesh);
            var southBB = new THREE.Box3().setFromObject(mesh2);
            var eastBB = new THREE.Box3().setFromObject(mesh3);
            var westBB = new THREE.Box3().setFromObject(mesh4);


            if (headBB.isIntersectionBox(northBB) ||
                headBB.isIntersectionBox(southBB) ||
                headBB.isIntersectionBox(eastBB) ||
                headBB.isIntersectionBox(westBB)) {
                gameLost = 0;
            }

            console.log(direction);

            if (direction == "r") {
                right();
            } else if (direction == "l") {
                left();
            } else if (direction == "u") {
                up();
            } else if (direction == "d") {
                down();
            }

            //cameraUpdate();

            for (var i = 1; i < meshes.length; i++) {
                if (meshes[i].position.x == meshes[0].position.x &&
                    meshes[i].position.y == meshes[0].position.y) {
                    gameLost = 0;
                }
            }
        }

        doUpdate = false;
        eingabe = false;
    }

    // cameraUpdate();
    camera.update();
    renderer.render(scene, camera);
}