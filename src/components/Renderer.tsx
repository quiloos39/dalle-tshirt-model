import { OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export const Renderer = ({ texture }: { texture: string }) => {
  const camera = useRef<typeof PerspectiveCamera>();

  return (
    <Canvas className=" bg-gray-300" shadows>
      <OrbitControls />
      <PerspectiveCamera ref={camera} args={[]} />
      <TShirt texture={texture} />
    </Canvas>
  );
};

const TShirt = ({ texture }: { texture: string }) => {
  const props = useTexture([texture]);
  const obj = useLoader(OBJLoader, "/tshirt.obj");
  const geometry = useMemo(() => {
    let g;
    obj.traverse((c) => {
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  return (
    <>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial map={props[0]} />
      </mesh>
      {/* <ambientLight intensity={0.3} /> */}
      <directionalLight intensity={0.8} position={[2, 10, 2]} castShadow />
      <ambientLight intensity={0.1} />
    </>
  );
};
