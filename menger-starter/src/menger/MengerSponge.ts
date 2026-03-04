import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {

  private level: number = 0;
  private dirty: boolean = true;
  private static readonly maxLevel: number = 4;

  private positions: number[] = [];
  private indices: number[] = [];
  private normals: number[] = [];

  constructor(level: number) {
	  this.setLevel(level);
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
    return this.dirty;
  }

  // Set the sponge as clean
  public setClean(): void {
    this.dirty = false;
  }
  
  // Set the level of the sponge, which determines its geometry
  public setLevel(level: number)
  {
    if (level < 1)
      this.level = 1;
    else if (level > MengerSponge.maxLevel)
      this.level = MengerSponge.maxLevel;
    else
      this.level = level;

    this.generate_geometry();
    this.dirty = true;
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
	  return new Float32Array(this.positions);
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    return new Uint32Array(this.indices);
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
	  return new Float32Array(this.normals);
  }

  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {
    const ret : Mat4 = new Mat4().setIdentity();
    return ret;    
  }

  // Adds a cube's vertices, normals, and indices to the geometry arrays.
  private addCube(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void {

    // Each side contains its 4 corners and a normal vector
    const sides: { corners: number[][]; normal: number[] }[] = [
    // Front Side
    { corners: [[minX,minY,maxZ],[maxX,minY,maxZ],[maxX,maxY,maxZ],[minX,maxY,maxZ]], normal: [0,0,1] },
    // Back Side
    { corners: [[maxX,minY,minZ],[minX,minY,minZ],[minX,maxY,minZ],[maxX,maxY,minZ]], normal: [0,0,-1] },
    // Top Side
    { corners: [[minX,maxY,maxZ],[maxX,maxY,maxZ],[maxX,maxY,minZ],[minX,maxY,minZ]], normal: [0,1,0] },
    // Bottom Side
    { corners: [[minX,minY,minZ],[maxX,minY,minZ],[maxX,minY,maxZ],[minX,minY,maxZ]], normal: [0,-1,0] },
    // Right Side
    { corners: [[maxX,minY,maxZ],[maxX,minY,minZ],[maxX,maxY,minZ],[maxX,maxY,maxZ]], normal: [1,0,0] },
    // Left Side
    { corners: [[minX,minY,minZ],[minX,minY,maxZ],[minX,maxY,maxZ],[minX,maxY,minZ]], normal: [-1,0,0] },
    ];

    // For every side, add the 4 corners and the normal for this side to our geometry arrays.
    for (const side of sides) {
      // Since we add 4 numbers for each vertex, the index is the total length divided by 4
      const index = this.positions.length / 4;
      for (const c of side.corners) {
        this.positions.push(c[0], c[1], c[2], 1.0);
        this.normals.push(side.normal[0], side.normal[1], side.normal[2], 0.0);
      }

      // Add the two counter-clockwise triangles that make this side
      this.indices.push(index, index + 1, index + 2);
      this.indices.push(index, index + 2, index + 3);
    }
  }

  // Function that will recursively generate the sponge geometry, if the depth is 0 it will be a whole cube
  // but if the depth is greater than 0 it will divide it into 27 subcubes and delete the 7 inner ones then recurse until depth = 0
    private generateSponge(depth: number, minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void {
      // If the depth is 0, generate a solid cube and stop recursing
      if (depth === 0) {
      this.addCube(minX, minY, minZ, maxX, maxY, maxZ);
        return;
      }

      // Each subcube side length is one third the side length of the current cube, 
      // and all side lengths are equal since it's a cube
      const subCubeLength = (maxX - minX) / 3;

      // Iterate over the 3x3x3 grid of subcubes
      for (let ix = 0; ix < 3; ix++) {
        for (let iy = 0; iy < 3; iy++) {
          for (let iz = 0; iz < 3; iz++) {
            // Only keep the 20 sub-cubes on the edges/corners, and skip the 7 inner ones that get removed
            if (
              (ix === 1 && iy === 1) || (ix === 1 && iz === 1) ||(iy === 1 && iz === 1)) {
                continue; }

            // Find the bounding box of this subcube
            const subMinX = minX + ix * subCubeLength;
            const subMinY = minY + iy * subCubeLength;
            const subMinZ = minZ + iz * subCubeLength;
            const subMaxX = subMinX + subCubeLength;
            const subMaxY = subMinY + subCubeLength;
            const subMaxZ = subMinZ + subCubeLength;

            this.generateSponge(depth - 1, subMinX, subMinY, subMinZ, subMaxX, subMaxY, subMaxZ);
          }
        }
      }
    }

    private generate_geometry(): void {
      // Clear the geometry arrays
      this.positions = [];
      this.indices = [];
      this.normals = [];

      // Generate new geometry for the sponge based on the current level
      this.generateSponge(this.level - 1, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5);
    }
  }
