import {
  BufferAttribute,
  BufferGeometry,
  Line,
  Points,
  Vector2,
  Vector3,
  Shape as Plane,
} from "three";
import { CartesianPoint, GeographicPoint } from "../globe-rs";
import { SPHERE_SEGMENTS } from "./geometry";
import { newLineBasicMaterial, newPointsMaterial } from "./material";

interface Shape {
  points: Array<GeographicPoint>;
  is_solid?: boolean;
}

const getLines = async (
  shape: Shape,
  smoothness = 2 * SPHERE_SEGMENTS
): Promise<Array<Line>> => {
  return shape.points
    .map(CartesianPoint.from_geographic)
    .map((point, index, all) => {
      const next = all[index + 1] ?? (shape.is_solid ? all[0] : point);
      return [
        new Vector3(point.x(), point.y(), point.z()),
        new Vector3(next.x(), next.y(), next.z()),
      ];
    })
    .map(([pointStart, pointEnd]) => {
      const cb = new Vector3();
      const ab = new Vector3();
      const normal = new Vector3();

      cb.subVectors(new Vector3(), pointEnd);
      ab.subVectors(pointStart, pointEnd);
      cb.cross(ab);
      normal.copy(cb).normalize();

      const angle = pointStart.angleTo(pointEnd); // get the angle between vectors
      const angleDelta = angle / (smoothness - 1); // increment

      const points = [];
      for (let i = 0; i < smoothness; i++) {
        // this is the key operation
        points.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i));
      }

      const geometry = new BufferGeometry().setFromPoints(points);
      return new Line(geometry, newLineBasicMaterial());
    });
};

const getPoints = async (shape: Shape): Promise<Points> => {
  const vertices = new Float32Array(
    shape.points
      .map(CartesianPoint.from_geographic)
      .map((point) => {
        return [point.x(), point.y(), point.z()];
      })
      .flat()
  );

  const pointsGeometry = new BufferGeometry();
  pointsGeometry.attributes.position = new BufferAttribute(vertices, 3);

  return new Points(pointsGeometry, newPointsMaterial());
};

const getPlane = async (shape: Shape): Promise<Plane> => {
  const vertices = shape.points
    .map(CartesianPoint.from_geographic)
    .map((point) => {
      return new Vector2(point.x(), point.y());
    });

  return new Plane(vertices);
};

export { Shape, getLines, getPoints, getPlane };
