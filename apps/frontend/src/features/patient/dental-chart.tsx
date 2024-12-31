import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Import all tooth models
const implantModel = new URL(
  '../../asset/3dModels/implant.obj',
  import.meta.url,
).href;
const tooth2Model = new URL('../../asset/3dModels/tooth2.obj', import.meta.url)
  .href;
const tooth25Model = new URL(
  '../../asset/3dModels/tooth25.obj',
  import.meta.url,
).href;
const tooth27Model = new URL(
  '../../asset/3dModels/tooth27.obj',
  import.meta.url,
).href;
const tooth28Model = new URL(
  '../../asset/3dModels/tooth28.obj',
  import.meta.url,
).href;
const tooth29Model = new URL(
  '../../asset/3dModels/tooth29.obj',
  import.meta.url,
).href;
const tooth3Model = new URL('../../asset/3dModels/tooth3.obj', import.meta.url)
  .href;

const DentalChart = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load tooth models
    const loader = new OBJLoader();
    const toothModels = [
      { url: implantModel, position: new THREE.Vector3(-3, 0, 0) },
      { url: tooth2Model, position: new THREE.Vector3(-2, 0, 0) },
      { url: tooth3Model, position: new THREE.Vector3(-1, 0, 0) },
      { url: tooth25Model, position: new THREE.Vector3(0, 0, 0) },
      { url: tooth27Model, position: new THREE.Vector3(1, 0, 0) },
      { url: tooth28Model, position: new THREE.Vector3(2, 0, 0) },
      { url: tooth29Model, position: new THREE.Vector3(3, 0, 0) },
    ];

    toothModels.forEach(({ url, position }) => {
      loader.load(
        url,
        (object) => {
          object.position.copy(position);
          object.scale.set(0.1, 0.1, 0.1); // Scale down the models
          scene.add(object);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        },
      );
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default DentalChart;
