import { Vector3 } from "three";

export const Direction = {
    DOWN: new Vector3(0, -1, 0),
    UP: new Vector3(0, 1, 0),
    NORTH: new Vector3(0, 0, -1),
    SOUTH: new Vector3(0, 0, 1),
    WEST: new Vector3(-1, 0, 0),
    EAST: new Vector3(1, 0, 0)
};
