CS335 Project 2 - Menger Sponge
Authors: Jesse Cottrell, Fatima Fayazi, Daniel Howard, Madison Lanaghan, Katie Lester, Dillon Scott
Pink Group

Compile Instructions:
  Ensure all files are correctly downloaded onto your machine
  Ensure NPM package manager, TypeScript compiler tsc, and http-server are all installed correctly
  In the terminal, navigate so that you are within the /menger-starter directory
  Run "python3 make-menger.py"
  Run "http-server dist -c-1"
  Follow the link to open up the GUI in a window on your machine
  The given tests can be run by selecting "Run Test Suite", and clicking on the name of the test you want to expand the results for
    * The image on top is our implemtation, the bottom is a reference for what behavior our implemtation worked to imitate

Common Usage:
  Keyboard Commands
    Numbers 1-4: Generate the sponge for that layer of recursion (1=no recursion/full cube, 4=3 layers of recursion)
    W/S/A/D: Move around the space - imitating FPS behavior - allows the camera to get closer to the cube
    Left/Right Arrows: Roll/Spin the camera
    Up/Down Arrows: Move the camera up/down
    Control+S: Save the current cube orientation as an obj file
  Mouse Inputs
    Right Click + Dragging Mouse Up/Down: Zooms the camera in/out
    Left Click + Dragging Mouse Any Direction: Rotate the camera more freely than can be done with keyboard commands
