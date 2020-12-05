////////////////////////////////////////////////////////////////////////////////
// transformation-b.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Transformation B".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
//
// Studiengang: BMI
// Gruppe     : D
// Autor 1    : Borges, Yannik
// Autor 2    : Kammann, Thomas
// Autor 3    : Keidel, Janina
// Autor 4    : Michalak, Daniel
// Autor 5    : Schmitt, Nadine
////////////////////////////////////////////////////////////////////////////////



// globale variablen
var sceneRoot;  // speichert den Wurzelknoten der Szene



////////////////////////////////////////////////////////////////////////////////
// renderScene(time)
// Wird aufgerufen, wenn die gesamte Szene gerendert werden muss.
// In der Variable time wird die verstrichene Zeit in Sekunden übergeben.
////////////////////////////////////////////////////////////////////////////////
function renderScene(time)
{
  // Transformationsmatrix fuer Punkte
  var pointMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0);
  // Transformationsmatrix fuer Normalen
  var normalMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
                                 0.0, 1.0, 0.0, 0.0,
                                 0.0, 0.0, 1.0, 0.0,
                                 0.0, 0.0, 0.0, 1.0);
  // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe
  var timeScale = 1.0;

  // verstrichene Zeit in Sekunden werden in Abhängigkeit des timescales berechnet
  time = timeScale * time;
    
  //Szenenwurzel rendern
  renderSceneElements(sceneRoot, pointMatrix, normalMatrix, time);

}

////////////////////////////////////////////////////////////////////////////////
// renderSceneElements(element, pointMatrix, normalMatrix, time)
// Wird aufgerufen, wenn die einzelenen Elemente der Szene gerendert werden müssen. 
////////////////////////////////////////////////////////////////////////////////
function renderSceneElements(element, pointMatrix, normalMatrix, time) {

    //Variable für die Kopie der Punktmatrix
    var pointMatrixCloned = pointMatrix.clone();
    
    //Variable für die Kopie der Normalenmatrix
    var normalMatrixCloned = normalMatrix.clone();

    //wenn das übergebene Element und ihre Form definiert sein sollten:
    if(element != undefined) {
      if(element.shape != undefined) {
          
          // Tranformation des Szenenknotens bestimmen
          var nodeTransformation = element.animator(time);
          
          // Transformation des Szenenknotens anwenden
          pointMatrix.multiplySelf(nodeTransformation.pointMatrix);
          normalMatrix.multiplySelf(nodeTransformation.normalMatrix);

          // Szenenknoten rendern
          renderSceneNode(element, pointMatrix, normalMatrix);

          //Die Funktion für alle Kinder aufrufen
          //Falls das Element ein Kind enthält...
          if(element.children != undefined) {
            //gehen wir mit einer Schleife durch das Array
            for(var i = 0; i < element.children.length; i++) {
                //und übernehmen jeweils die Punkt- und Normalenmatrix des Elternelements
                pointMatrix.copy(pointMatrixCloned);
                normalMatrix.copy(normalMatrixCloned);

                //Falls die Transformation des Szenenknotens eine Rotation und  transformation enthält...
                if(nodeTransformation.rotation != undefined && nodeTransformation.transform != undefined) {
                      //werden jeweils Punkt- und Normalenmatrix rotiert und transformiert
                      pointMatrix.multiplySelf(nodeTransformation.rotation);
                      pointMatrix.multiplySelf(nodeTransformation.transform);
                      normalMatrix.multiplySelf(nodeTransformation.rotation);
                      normalMatrix.multiplySelf(nodeTransformation.transform);
                }

                //Szenenelemente rendern
                renderSceneElements(element.children[i], pointMatrix, normalMatrix , time);
            }
          }
      }
   }
}



////////////////////////////////////////////////////////////////////////////////
// initScene()
// Wird aufgerufen, wenn die Szene initialisiert werden soll.
// Erstellt den Szenengraphen.
////////////////////////////////////////////////////////////////////////////////
function initScene()
{
    //Monde
  var moon ={
      animator: animateMoon,
      shape: CreateMoon(),
      children:[]
  };

  var phobos ={
      animator: animatePhobos,
      shape: CreateMoon(),
      children:[]
  };

  var deimos ={
      animator: animateDeimos,
      shape: CreateMoon(),
      children:[]
  };


    //Planeten
    //Merkur
  var mercury = {
      animator: animateMercury,
      shape: CreateMercury(),
      children: []
  };

    //Venus
  var venus = {
      animator: animateVenus,
      shape: CreateVenus(),
      children: []
  };

    //Erde
  var earth = {
      animator: animateEarth,
      shape: CreateEarth(),
      children: [moon]
  };

    //Mars
  var mars = {
      animator: animateMars,
      shape: CreateMars(),
      children: [deimos, phobos]
  };
  
  // Sonne
  var sun = {
    animator: animateSun,
    shape: CreateSun(),
    children: [mercury, venus, earth, mars]
  };

  // Setze die Sonne als Wurzelknoten der Szene.
  sceneRoot = sun;
}





////////////////////////////////////////////////////////////////////////////////
// Animate-Funktionen
////////////////////////////////////////////////////////////////////////////////
// -- Sonne --------------------------------------------------------------------
function animateSun(time)
{
  return {
    pointMatrix:  new Matrix4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0),
    normalMatrix: new Matrix4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0)
  };
}

// -- Erde ---------------------------------------------------------------------
function animateEarth(time)
{
    //Erdradius
    var radius = 13;
    //Bahnradius
    var orbitRadius = 200;
    //Achsenumdrehung
    var axisRotation = 1;
    //Umlaufzeit
    var orbitalPeriod = 365.2;
    //berechnet Matrix für die Erde
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    
    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Mond ---------------------------------------------------------------------
function animateMoon(time)
{
    var radius = 3.5;
    var orbitRadius = 22;
    var axisRotation = 27.3;
    var orbitalPeriod = 27.3;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Phobos -------------------------------------------------------------------
function animatePhobos(time)
{
    var radius = 2.5;
    var orbitRadius = 15;
    var axisRotation = 0.3;
    var orbitalPeriod = 0.3;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Deimos -------------------------------------------------------------------
function animateDeimos(time)
{
    var radius = 1.5;
    var orbitRadius = 20;
    var axisRotation = 1.3;
    var orbitalPeriod = 1.3;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Merkur -------------------------------------------------------------------
function animateMercury(time)
{
    var radius = 5;
    var orbitRadius = 76;
    var axisRotation = 58.7;
    var orbitalPeriod = 88;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Venus --------------------------------------------------------------------
function animateVenus(time)
{
    var radius = 12;
    var orbitRadius = 145;
    var axisRotation = 243;
    var orbitalPeriod = 224.7;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}

// -- Mars ---------------------------------------------------------------------
function animateMars(time)
{
    var radius = 7;
    var orbitRadius = 305;
    var axisRotation = 1;
    var orbitalPeriod = 687;
    var matrix = calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod);

    return {
        pointMatrix: matrix.matrix,
        normalMatrix: matrix.matrix,
        transform: matrix.transform,
        rotation: matrix.rotation
    };
}


////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////

// -- Berechnung der Transformationsmatrix ------------------------------------
function calculateMatrix(time, radius, orbitRadius, axisRotation, orbitalPeriod){
    
    var normalP = new Matrix4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0);

    //berechne Skalierungs-, Rotations-, Achsenrotations- und Translationsmatrix 
    //speichere diese jeweils in eine Variable
    var sMatrix = scaleMatrix(radius);
    var rMatrix = rotateMatrix(time, orbitalPeriod);
    var axisRMatrix = rotateMatrix(time, axisRotation);
    var tMatrix = translateMatrix(orbitRadius);

    //Multipliziere alle Matrizen mit der Transformagtionsmatrix für Punkte/Normalen
    //wir möchten zuerst um die eigene Achse rotieren, dann das Element skalieren, 
    //dann das Element verschieben und zum Schluss die Rotation in der Umlaufbahn bestimmen
    //Beim Zusammenfassen der Matrix muss die Reihenfolge umgedreht werden     
    normalP.multiplySelf(rMatrix);
    normalP.multiplySelf(tMatrix);
    normalP.multiplySelf(sMatrix);
    normalP.multiplySelf(axisRMatrix);

    return {
        matrix: normalP,
        transform: tMatrix,
        rotation: rMatrix
    };
}


// -- Allgemeine Skalierungsmatrix ---------------------------------------------
function scaleMatrix(radius) {
    var newMatrix = new Matrix4(radius * 1.0, 0.0, 0.0, 0.0,
                                0.0, radius * 1.0, 0.0, 0.0,
                                0.0, 0.0, radius * 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0);
    return newMatrix;
}

// -- Allgemeine Rotationsmatrix -----------------------------------------------
function rotateMatrix(time, orbitalPeriod) {
    var alpha = ((2*Math.PI*time)/orbitalPeriod);
    
    var newMatrix = new Matrix4(Math.cos(alpha) * 1.0 , 0.0, -(Math.sin(alpha)) * 1.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                Math.sin(alpha) * 1.0, 0.0, Math.cos(alpha) * 1.0 * 1.0 , 0.0,
                                0.0, 0.0, 0.0, 1.0);
    return newMatrix;
}

// -- Allgemeine Translationsmatrix ---------------------------------------------
function translateMatrix(orbitRadius) {
    var newMatrix = new Matrix4(1.0, 0.0, 0.0, orbitRadius,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0);
    return newMatrix;
}
