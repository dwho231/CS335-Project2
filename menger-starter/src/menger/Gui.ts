import { Camera, RayCamera } from "../lib/webglutils/Camera.js";
import { CanvasAnimation } from "../lib/webglutils/CanvasAnimation.js";
import { MengerSponge } from "./MengerSponge.js";
import { Mat4, Vec3 } from "../lib/TSM.js";

/**
 * Might be useful for designing any animation GUI
 */
interface IGUI {
  viewMatrix(): Mat4;
  projMatrix(): Mat4;
  dragStart(me: MouseEvent): void;
  drag(me: MouseEvent): void;
  dragEnd(me: MouseEvent): void;
  onKeydown(ke: KeyboardEvent): void;
}

/**
 * Handles Mouse and Button events along with
 * the the camera.
 */
export class GUI implements IGUI {
  private static readonly rotationSpeed: number = 0.05;
  private static readonly zoomSpeed: number = 0.1;
  private static readonly rollSpeed: number = 0.1;
  private static readonly panSpeed: number = 0.1;

  private camera: Camera;
  private dragging: boolean;
  private fps: boolean;
  private prevX: number;
  private prevY: number;

  private height: number;
  private width: number;

  private sponge: MengerSponge;
  private animation: CanvasAnimation;

  private isPressing2: boolean;
  private isPressing0: boolean;

  /**
   *
   * @param canvas required to get the width and height of the canvas
   * @param animation required as a back pointer for some of the controls
   * @param sponge required for some of the controls
   */
  constructor(
    canvas: HTMLCanvasElement,
    animation: CanvasAnimation,
    sponge: MengerSponge
  ) {
    this.height = canvas.height;
    this.width = canvas.width;
    this.prevX = 0;
    this.prevY = 0;

    this.sponge = sponge;
    this.animation = animation;

	this.reset();

    this.registerEventListeners(canvas);
  }

  /**
   * Resets the state of the GUI
   */
  public reset(): void {
    this.fps = false;
    this.dragging = false;
    /* Create camera setup */
    this.camera = new Camera(
      new Vec3([0, 0, -6]),
      new Vec3([0, 0, 0]),
      new Vec3([0, 1, 0]),
      45,
      this.width / this.height,
      0.1,
      1000.0
    );
  }

  /**
   * Sets the GUI's camera to the given camera
   * @param cam a new camera
   */
  public setCamera(
    pos: Vec3,
    target: Vec3,
    upDir: Vec3,
    fov: number,
    aspect: number,
    zNear: number,
    zFar: number
  ) {
    this.camera = new Camera(pos, target, upDir, fov, aspect, zNear, zFar);
  }

  /**
   * Returns the view matrix of the camera
   */
  public viewMatrix(): Mat4 {
    return this.camera.viewMatrix();
  }

  /**
   * Returns the projection matrix of the camera
   */
  public projMatrix(): Mat4 {
    return this.camera.projMatrix();
  }



  /**
   * Callback function for the start of a drag event.
   * @param mouse
   */
  public dragStart(mouse: MouseEvent): void {
    this.dragging = true;
    this.prevX = mouse.screenX;
    this.prevY = mouse.screenY;

    // We only care about rotating the camera if we are holding down the left mouse button
    if (mouse.button == 0)
    {
      this.isPressing0 = true;
    }

    // We only care about zooming in if we are holding down the right mouse button
    if (mouse.button == 2)
    {
      this.isPressing2 = true;
    }
  }

  /**
   * The callback function for a drag event.
   * This event happens after dragStart and
   * before dragEnd.
   * @param mouse
   */
  public drag(mouse: MouseEvent): void 
  {
	  
	  // TODO: Your code here for left and right mouse drag
    const deltaX = mouse.screenX - this.prevX;
    const deltaY = mouse.screenY - this.prevY;
    
    // Left mouse button handles camera rotation
    if (this.isPressing0)
    {

    }
  
    // Right mouse button handles camera zooming
     if (this.isPressing2)
     {

        // Dragging mouse up = zoom in
        if (deltaY > 0)
        {
          this.camera.offsetDist(GUI.zoomSpeed);
        }

        // Dragging mouse down = zoom out
        else if (deltaY < 0)
        {
          this.camera.offsetDist(-GUI.zoomSpeed);
        }

      }
  }
	  
  
  /**
   * Callback function for the end of a drag event
   * @param mouse
   */
  public dragEnd(mouse: MouseEvent): void {
    this.dragging = false;
    this.prevX = 0;
    this.prevY = 0;
    this.isPressing2 = false;
    this.isPressing0 = false;
  }

  /**
   * Callback function for a key press event
   * @param key
   */
  public onKeydown(key: KeyboardEvent): void {
    /*
       Note: key.code uses key positions, i.e a QWERTY user uses y where
             as a Dvorak user must press F for the same action.
       Note: arrow keys are only registered on a KeyDown event not a
       KeyPress event
       We can use KeyDown due to auto repeating.
     */

	// TOOD: Your code for key handling

    switch (key.code) {

      // Holding down the W or S key should translate both the eye and center by +/- zoom_speed times the look direction
      // W = move closer
      case "KeyW": 
      {
        this.camera.offset(this.camera.forward().copy(), -GUI.zoomSpeed, true);
        break;
      }

      // Holding down the A or D key should translate both the eye and center by +/- pan_speed times the right direction
      // A = move view to the left
      case "KeyA":
      {
        this.camera.offset(this.camera.right().copy(), -GUI.panSpeed, true);
        break;
      }

      // Holding down the W or S key should translate both the eye and center by +/- zoom_speed times the look direction
      // S = move away
      case "KeyS": 
      {
        this.camera.offset(this.camera.forward().copy(), GUI.zoomSpeed, true);
        break;
      }

      // Holding down the A or D key should translate both the eye and center by +/- pan_speed times the right direction
      // D = move view to the right
      case "KeyD": 
      {
        this.camera.offset(this.camera.right().copy(), GUI.panSpeed, true);
        break;
      }

      case "KeyR": 
      {
        break;
      }

      // Pressing the left and right arrow keys should roll the camera, spin it counterclockwise/clockwise by roll_speed radians per frame
      // Left = counterclockwise
      case "ArrowLeft": 
      {
        this.camera.roll(GUI.rollSpeed, false);
        break;
      }

      // Pressing the left and right arrow keys should roll the camera, spin it counterclockwise/clockwise by roll_speed radians per frame
      // Right = clockwise
      case "ArrowRight": 
      {
        this.camera.roll(GUI.rollSpeed, true);
        break;
      }

      // Holding the up and down arrow keys should translate the camera position (like A and D) but this time in the +/- up direction
      // Up = move view up
      case "ArrowUp": 
      {
        this.camera.offset(this.camera.up().copy(), GUI.panSpeed, true);
        break;
      }

      // Holding the up and down arrow keys should translate the camera position (like A and D) but this time in the +/- up direction
      // Down = move view down
      case "ArrowDown": 
      {
        this.camera.offset(this.camera.up().copy(), -GUI.panSpeed, true);
        break;
      }

      case "Digit1": {
        this.sponge.setLevel(1);
        break;
      }
      case "Digit2": {
        this.sponge.setLevel(2);
        break;
      }
      case "Digit3": {
        this.sponge.setLevel(3);
        break;
      }
      case "Digit4": {
        this.sponge.setLevel(4);
        break;
      }
      default: {
        console.log("Key : '", key.code, "' was pressed.");
        break;
      }
    }
  }

  /**
   * Registers all event listeners for the GUI
   * @param canvas The canvas being used
   */
  private registerEventListeners(canvas: HTMLCanvasElement): void {
    /* Event listener for key controls */
    window.addEventListener("keydown", (key: KeyboardEvent) =>
      this.onKeydown(key)
    );

    /* Event listener for mouse controls */
    canvas.addEventListener("mousedown", (mouse: MouseEvent) =>
      this.dragStart(mouse)
    );

    canvas.addEventListener("mousemove", (mouse: MouseEvent) =>
      this.drag(mouse)
    );

    canvas.addEventListener("mouseup", (mouse: MouseEvent) =>
      this.dragEnd(mouse)
    );

    /* Event listener to stop the right click menu */
    canvas.addEventListener("contextmenu", (event: any) =>
      event.preventDefault()
    );
  }
}
