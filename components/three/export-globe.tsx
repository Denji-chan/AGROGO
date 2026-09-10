"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import coastlines from "@/data/world-coastlines.json";

function location(lon: number, lat: number, r = 1.01) {
  const phi = (lat * Math.PI) / 180,
    theta = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(phi) * Math.sin(theta),
    r * Math.sin(phi),
    r * Math.cos(phi) * Math.cos(theta),
  );
}
const origin = [69.24, 41.3];
const destinations = [
  [71.43, 51.13],
  [37.62, 55.75],
  [74.6, 42.87],
  [55.27, 25.2],
];
function Globe({ active }: { active: number }) {
  const group = useRef<THREE.Group>(null);
  const outlines = useMemo(() => {
    const points: number[] = [];
    for (const ring of coastlines) {
      for (let i = 0; i < ring.length - 1; i++) {
        points.push(
          ...location(ring[i][0], ring[i][1]).toArray(),
          ...location(ring[i + 1][0], ring[i + 1][1]).toArray(),
        );
      }
    }
    return new Float32Array(points);
  }, []);
  const paths = useMemo(
    () =>
      destinations.map(([lon, lat]) => {
        const a = location(origin[0], origin[1], 1.025),
          b = location(lon, lat, 1.025);
        const mid = a
          .clone()
          .add(b)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(1.13 + a.distanceTo(b) * 0.32);
        return new THREE.CatmullRomCurve3([a, mid, b]).getPoints(45);
      }),
    [],
  );
  useFrame((_, delta) => {
    if (group.current)
      group.current.rotation.y += Math.min(delta, 0.05) * 0.028;
  });
  return (
    <group ref={group} rotation={[0.48, -1.05, -0.1]}>
      <mesh>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial
          color="#194a34"
          roughness={0.78}
          metalness={0.15}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.004, 24, 16]} />
        <meshBasicMaterial
          color="#579771"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[outlines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#aed1a0" transparent opacity={0.75} />
      </lineSegments>
      {paths.map((points, i) => (
        <lineSegments key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  points.flatMap((p, j) =>
                    j < points.length - 1
                      ? [...p.toArray(), ...points[j + 1].toArray()]
                      : [],
                  ),
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={i === active ? "#ffe485" : "#8eac78"}
            transparent
            opacity={i === active ? 1 : 0.48}
          />
        </lineSegments>
      ))}
      {[origin, ...destinations].map(([lon, lat], i) => (
        <mesh key={i} position={location(lon, lat, 1.025)}>
          <sphereGeometry
            args={[i === 0 ? 0.023 : i === active + 1 ? 0.021 : 0.013, 12, 8]}
          />
          <meshBasicMaterial
            color={i === 0 || i === active + 1 ? "#ffdc68" : "#b4c7a8"}
          />
        </mesh>
      ))}
    </group>
  );
}
export default function ExportGlobe({
  active,
  visible,
}: {
  active: number;
  visible: boolean;
}) {
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 3.05], fov: 46 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.9} />
      <directionalLight position={[-3, 4, 3]} intensity={3} color="#fff5c6" />
      <Globe active={active} />
    </Canvas>
  );
}
