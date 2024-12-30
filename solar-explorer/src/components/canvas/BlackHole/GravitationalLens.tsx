import { Sphere, MeshTransmissionMaterial } from "@react-three/drei";

interface GravitationalLensProps {
  radius?: number;
  samples?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  distortion?: number;
  distortionScale?: number;
  temporalDistortion?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];
}

const GravitationalLens: React.FC<GravitationalLensProps> = ({
  radius = 500,
  samples = 16,
  thickness = 3,
  chromaticAberration = 1,
  anisotropy = 0.3,
  distortion = 0.5,
  distortionScale = 0.3,
  temporalDistortion = 0.5,
  iridescence = 1,
  iridescenceIOR = 1,
  iridescenceThicknessRange = [0, 1400],
}) => {
  return (
    <Sphere args={[radius, 604, 604]}>
      <MeshTransmissionMaterial
        backside
        samples={samples}
        thickness={thickness}
        chromaticAberration={chromaticAberration}
        anisotropy={anisotropy}
        distortion={distortion}
        distortionScale={distortionScale}
        temporalDistortion={temporalDistortion}
        iridescence={iridescence}
        iridescenceIOR={iridescenceIOR}
        iridescenceThicknessRange={iridescenceThicknessRange}
      />
    </Sphere>
  );
};

export default GravitationalLens;
