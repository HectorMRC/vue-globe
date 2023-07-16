import { CartesianPoint, GeographicPoint } from "../globe-rs";
import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  Scene,
} from "three";

interface ShapeMaterial {
  line: LineBasicMaterial;
  point: PointsMaterial;
}

const defaultShapeMaterial = {
  line: new LineBasicMaterial({
    color: 0xff00ff,
  }),

  point: new PointsMaterial({
    sizeAttenuation: false,
    color: 0xffff00,
    size: 10,
  }),
};

class Shape {
  rawPoints: Array<GeographicPoint>;
  lineSegments?: LineSegments;
  points?: Points;

  constructor(points?: Array<GeographicPoint>) {
    this.rawPoints = points ?? [];
  }

  private computeLineSegments = async (
    material: ShapeMaterial
  ): Promise<LineSegments> => {
    const vertices = new Float32Array(
      this.rawPoints
        .map(CartesianPoint.from_geographic)
        .map((point, index, all) => {
          const next = all[index + 1] ?? point;
          return [
            point.x(),
            point.y(),
            point.z(),
            next.x(),
            next.y(),
            next.z(),
          ];
        })
        .flat()
    );

    const segmentsGeometry = new BufferGeometry();
    segmentsGeometry.attributes.position = new BufferAttribute(vertices, 3);
    return new LineSegments(segmentsGeometry, material.line);
  };

  private computePoints = async (material: ShapeMaterial): Promise<Points> => {
    const vertices = new Float32Array(
      this.rawPoints
        .map(CartesianPoint.from_geographic)
        .map((point) => {
          return [point.x(), point.y(), point.z()];
        })
        .flat()
    );

    const pointsGeometry = new BufferGeometry();
    pointsGeometry.attributes.position = new BufferAttribute(vertices, 3);
    return new Points(pointsGeometry, material.point);
  };

  clean = (scene: Scene) => {
    if (this.lineSegments !== undefined) {
      scene.remove(this.lineSegments);
      this.lineSegments = undefined;
    }

    if (this.points !== undefined) {
      scene.remove(this.points);
      this.points = undefined;
    }
  };

  draw = async (
    scene: Scene,
    material: ShapeMaterial = defaultShapeMaterial
  ) => {
    this.clean(scene);

    const [segments, points] = await Promise.all([
      this.computeLineSegments(material),
      this.computePoints(material),
    ]);

    this.lineSegments = segments;
    this.points = points;

    scene.add(this.lineSegments);
    scene.add(this.points);
  };
}

export { Shape, ShapeMaterial };
