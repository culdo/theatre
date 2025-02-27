import {editable as e, SheetProvider, PerspectiveCamera} from '@theatre/r3f'
import {OrbitControls, Stars} from '@react-three/drei'
import type { ISheetObject} from '@theatre/core';
import {getProject} from '@theatre/core'
import React, {Suspense, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {useGLTF} from '@react-three/drei'
import sceneGLB from './scene.glb'
import type {Mesh, PerspectiveCamera as PerspectiveCameraImpl} from 'three'
import studio from '@theatre/studio'

document.body.style.backgroundColor = '#171717'

function Model({url}: {url: string}) {
  const {nodes} = useGLTF(url) as any

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
      <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.planet001.geometry}
          material={nodes.planet001.material}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.planet002.geometry}
          material={nodes.planet002.material}
        />
        <mesh
          geometry={nodes.planet003.geometry}
          material={nodes.planet003.material}
        />
      </group>
    </group>
  )
}

function App() {
  const bgs = ['#272730', '#b7c5d1']
  const [bgIndex, setBgIndex] = useState(0)
  const bg = bgs[bgIndex]
  const cameraTargetRef = useRef<Mesh>(null!)
  const cameraObjRef = useRef<ISheetObject>()
  const cameraRef = useRef<PerspectiveCameraImpl>()
  const onEnd = () => {
    const cameraObj = cameraObjRef.current
    const camera = cameraRef.current
    if (!cameraObj || !camera) return
    // const _onEnd = async () => {
    studio.transaction(({set}) => {
      set(cameraObj.props.position.x, camera.position.x)
      set(cameraObj.props.position.y, camera.position.y)
      set(cameraObj.props.position.z, camera.position.z)
      set(cameraObj.props.rotation.x, camera.rotation.x)
      set(cameraObj.props.rotation.y, camera.rotation.y)
      set(cameraObj.props.rotation.z, camera.rotation.z)
    })
    // }
    // _onEnd()
  }

  return (
    <div
      onClick={() => {
        // return setBgIndex((bgIndex) => (bgIndex + 1) % bgs.length)
      }}
      style={{
        height: '100vh',
      }}
    >
      <Canvas
        dpr={[1.5, 2]}
        linear
        shadows
        gl={{preserveDrawingBuffer: true}}
        frameloop="demand"
      >
        <OrbitControls onEnd={onEnd}></OrbitControls>
        <SheetProvider sheet={getProject('MMD').sheet('MMD UI')}>
          <fog attach="fog" args={[bg, 16, 30]} />
          <color attach="background" args={[bg]} />
          <ambientLight intensity={0.75} />
          <PerspectiveCamera
            objRef={cameraObjRef}
            ref={cameraRef}
            theatreKey="Camera"
            makeDefault
            position={[0, 0, 16]}
            fov={75}
            // lookAt={cameraTargetRef}
          >
            <pointLight intensity={1} position={[-10, -25, -10]} />
            <spotLight
              castShadow
              intensity={2.25}
              angle={0.2}
              penumbra={1}
              position={[-25, 20, -15]}
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <directionalLight />
          </PerspectiveCamera>
          <e.mesh
            ref={cameraTargetRef}
            theatreKey="Camera Target"
            position={[0, 0, 0]}
            visible="editor"
          >
            <boxGeometry attach="geometry" />
            <meshPhongMaterial attach="material" color="red" />
          </e.mesh>
          <Suspense fallback={null}>
            <Model url={sceneGLB} />
          </Suspense>
          <Stars radius={500} depth={50} count={1000} factor={10} />
        </SheetProvider>
      </Canvas>
    </div>
  )
}

export default App
