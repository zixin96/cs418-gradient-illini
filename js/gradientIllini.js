/**
 * @file A simple WebGL example drawing a capital letter I 
 * @author Zixin Zhang <zzhng151@illinois.edu>  
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/** @global The matrix used for ortho transformation */
var mvMatrix = mat4.create();

/**
 * Send the matrix to GPU (set uMVMatrix)
 */
function setMatrixUniforms(){
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
}
/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    
  // Get the uniform location 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    
}

/**
 * Populate buffers with data
 */
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
/*    
  var triangleVertices = [
          -0.25,  0.75,  0.0,
          -0.50,  0.75,  0.0,
          -0.5,  -0.75,  0.0,
      
          -0.5,  -0.75,  0.0,
          -0.25, -0.5,   0.0,
          -0.25,  0.75,  0.0,
      
          -0.5,  -0.75,  0.0,
           -0.25, -0.75,  0.0,
          -0.25, -0.5,   0.0
  ];
  */
    
    // We model a capital "I" using 10 vertices 
  var triangleVertices = [
          -5,     7.5, 0.0,
          -1.25,  5,   0.0,
          -5,     5,   0.0,

          -1.25,  5,   0.0,
          -5,     7.5, 0.0,
           5,     7.5, 0.0,

           5,     7.5, 0.0,
           1.25,  5,   0.0,
          -1.25,  5,   0.0,

           5,     7.5, 0.0,
           5,     5,   0.0,
           1.25,  5,   0.0,

      
      
      
           1.25,  5,   0.0,
          -1.25,  5,   0.0,
          -1.25, -5,   0.0,

          -1.25, -5,   0.0,
           1.25, -5,   0.0,
           1.25,  5,   0.0,

      
      
          -5,    -7.5, 0.0,
          -1.25, -5,   0.0,
          -5,    -5,   0.0,

          -1.25, -5,   0.0,
          -5,    -7.5, 0.0,
           5,    -7.5, 0.0,

           5,    -7.5, 0.0,
           1.25, -5,   0.0,
          -1.25, -5,   0.0,

           5,    -7.5, 0.0,
           5,    -5,   0.0,
           1.25, -5,   0.0
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 30;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    // Make it multi-colored (a gradient from orange to blue)
  var colors = [
        //Top bar
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
      
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
      
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
      
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
      
      
        // A gradiate from orange to blue
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.9, 0.5, 0.2, 1.0,
      
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
        0.0, 0.0, 0.8, 1.0,
      
      
      
        //Bottom bar
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
      
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
      
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
      
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0,
        0.9, 0.5, 0.2, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 30;  
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 */
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
    
  //Create the ortho matrix 
  mat4.ortho(mvMatrix, -10, 10, -10, 10, -1, 1);
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  // Send the ortho matrix to the GPU before issuing a draw 
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

/**
 * Startup function called from html code to start program.
 */
 function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 0.0);  //Background color is white (0.0, 0.0, 0.0, 0.0). If black, (0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST);
  draw();
}


