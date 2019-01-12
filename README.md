# Gradient Illini
This is the result of a simple WebGL example drawing a capital letter I.  

**Modeling**: 

I model the letter with a 2-D mesh of triangles. In order to use a convenient coordinate system to generate the vertices, a orthogonal projection matrix is used to map our viewing volume to the WebGL view volume (so that we can see it in front of us).

**Rendering**:  

I color the letter using two color:
<span style="color:blue">blue (0.0, 0.0, 0.8, 1.0)</span>
and <span style="color:orange">orange (0.9, 0.5, 0.2, 1.0)</span>. Gradient effect is created by utilziing the fact that color values are interpolated and passed to the fragment shader for each pixel. All we need to do is to assign the right color to the right vertex to create our gradient effect. 
