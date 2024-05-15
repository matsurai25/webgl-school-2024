import { media } from '@/const'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper === null) {
      return
    }
    const app = new ThreeApp(wrapper)
    app.render()
    ;(window as any).app = app
    return () => {
      wrapper.removeChild(app.renderer.domElement)
    }
  }, [])

  return (
    <Wrapper ref={wrapperRef}>
      <BackLink href={'/'}>BACK</BackLink>
      <Img src={'/report1.svg'} />
      <Overlay />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0000dd;

  canvas {
    &.intersecting {
      cursor: pointer;
    }
  }
`

const BackLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1;
  font-size: 1.6rem;
  background-color: #000000;
  z-index: 100;
  padding: 1.2rem 4rem;
  border-radius: 4rem;

  ${media.mobile} {
    top: 1.6rem;
    left: 1.6rem;
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
    border-radius: 4rem;
  }
`

const Img = styled.img`
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  width: 80rem;

  ${media.mobile} {
    bottom: 0.8rem;
    right: 0.8rem;
    width: 32rem;
  }
`

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: fixed;
  z-index: 10;
  // 上から下に向かってグラデーションをかける
  background-image: linear-gradient(
    to bottom,
    rgb(239, 239, 239, 0.8),
    rgb(239, 239, 239, 0) 50%
  );
`

class ThreeApp {
  static CAMERA_PARAM = {
    // fovy は Field of View Y のことで、縦方向の視野角を意味する
    fovy: 60,
    // 描画する空間のニアクリップ面（最近面）
    near: 0.1,
    // 描画する空間のファークリップ面（最遠面）
    far: 100.0,
    // カメラの座標
    position: new THREE.Vector3(
      -2.387185024655694,
      3.0,
      -0.4343859748540797
    ),
    // カメラの注視点
    lookAt: new THREE.Vector3(1, 0, 1.5)
  }
  static RENDERER_PARAM = {
    clearColor: 0x0000dd // 画面をクリアする色
  }
  /**
   * 平行光源定義のための定数
   */
  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 5.0, // 光の強度
    position: new THREE.Vector3(1.0, 1.0, 1.0) // 光の向き
  }
  /**
   * アンビエントライト定義のための定数
   */
  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 0.1 // 光の強度
  }
  /**
   * マテリアル定義のための定数
   */
  static MATERIAL_PARAM = {
    color: 0xefefef // マテリアルの基本色
  }

  static hightlightColor = 0x0000dd

  wrapper
  renderer
  scene
  camera
  directionalLight
  ambientLight
  material
  boxGeometry
  boxes
  plane
  controls
  mousePos: THREE.Vector2 | null
  willChangeBoxes: {
    uuid: string
    color: number
    y: number
    timeOffset: number
  }[]
  clock: THREE.Clock

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper
    // レンダラー
    const color = new THREE.Color(
      ThreeApp.RENDERER_PARAM.clearColor
    )
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor(color)
    this.renderer.setSize(
      this.wrapper.clientWidth,
      this.wrapper.clientHeight
    )
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.wrapper.appendChild(this.renderer.domElement)
    this.clock = new THREE.Clock()

    // シーン
    this.scene = new THREE.Scene()

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      this.getWrapperAspectRatio(),
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far
    )
    this.camera.position.copy(
      ThreeApp.CAMERA_PARAM.position
    )
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt)

    // コントロールを作成
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    // 目標点を設定
    this.controls.target.copy(ThreeApp.CAMERA_PARAM.lookAt)
    // ユーザーの操作を無効にする
    this.controls.enableRotate = false
    this.controls.enableZoom = false
    this.controls.enablePan = false

    // 初期化後にカメラの投影行列を更新
    this.controls.update()

    // ディレクショナルライト（平行光源）
    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    )
    this.directionalLight.position.copy(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.position
    )
    this.scene.add(this.directionalLight)

    // アンビエントライト（環境光）
    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity
    )
    this.scene.add(this.ambientLight)

    // マテリアル
    this.material = new THREE.MeshPhongMaterial(
      ThreeApp.MATERIAL_PARAM
    )

    // 床面
    const planeGeometry = new THREE.PlaneGeometry(300, 300)
    const planeMaterial = this.material.clone()

    this.plane = new THREE.Mesh(
      planeGeometry,
      planeMaterial
    )
    this.plane.rotation.x = -Math.PI / 2
    this.plane.position.y = 0
    this.scene.add(this.plane)

    // 共通のジオメトリ、マテリアルから、複数のメッシュインスタンスを作成する @@@
    const boxCount = 500
    const paging = 20
    const transformScale = 1.0
    const gridGap = 1.2
    this.boxGeometry = new THREE.BoxGeometry(1, 0.5, 1)
    this.boxes = []
    this.willChangeBoxes = []
    for (let i = 0; i < boxCount; ++i) {
      const box = new THREE.Mesh(
        this.boxGeometry,
        this.material.clone()
      )
      // 座標をpaging x pagingのグリッド状に配置する
      box.position.x =
        (i % paging) * gridGap * transformScale
      box.position.y = -0.26
      box.position.z =
        gridGap *
        (Math.floor(i / paging) - 6) *
        transformScale

      // シーンに追加する
      this.scene.add(box)

      // 配列に入れておく
      this.boxes.push(box)

      this.willChangeBoxes.push({
        uuid: box.uuid,
        color: ThreeApp.MATERIAL_PARAM.color,
        y: box.position.y,
        timeOffset: Math.random() * 5.0
      })
    }

    window.setTimeout(() => {
      this.setRandomYChange()
    }, 1000)

    this.render = this.render.bind(this)

    window.addEventListener(
      'resize',
      () => {
        this.renderer.setSize(
          this.wrapper.clientWidth,
          this.wrapper.clientHeight
        )
        this.camera.aspect = this.getWrapperAspectRatio()
        this.camera.updateProjectionMatrix()
      },
      false
    )

    this.mousePos = null
    window.addEventListener(
      'mousemove',
      (ev) => {
        const x = (ev.clientX / window.innerWidth) * 2 - 1
        const y = -(ev.clientY / window.innerHeight) * 2 + 1
        this.mousePos = new THREE.Vector2(x, y)
        this.handleOnIntersect()
      },
      false
    )
    window.addEventListener(
      'mouseleave',
      () => {
        this.mousePos = null
      },
      false
    )

    // マウスクリック時に、マウス位置にあるオブジェクトの色を変える
    window.addEventListener(
      'click',
      () => {
        if (this.mousePos === null) {
          return
        }
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(this.mousePos, this.camera)
        const intersects = raycaster.intersectObjects(
          this.boxes
        )
        if (intersects.length > 0) {
          const intersect = intersects[0]
          const targetBox = this.willChangeBoxes.find(
            (willChangeBox) =>
              willChangeBox.uuid === intersect.object.uuid
          )
          if (targetBox !== undefined) {
            if (targetBox.y === 1.0) {
              targetBox.color =
                ThreeApp.MATERIAL_PARAM.color
              targetBox.y = 0.25
            } else {
              targetBox.color = ThreeApp.hightlightColor
              targetBox.y = 1.0
            }
          }
        }
      },
      false
    )
  }

  getWrapperAspectRatio() {
    return (
      this.wrapper.clientWidth / this.wrapper.clientHeight
    )
  }

  render() {
    requestAnimationFrame(this.render)

    // 経過時間を取得
    const elapsedTime = this.clock.getElapsedTime()
    if (elapsedTime > 1) {
      this.updateWillChangeBoxes()
    }

    // マウスポジションにあわせて、カメラの方向を変える
    if (this.mousePos !== null) {
      const x = this.mousePos.x
      const y = this.mousePos.y
      const newTarget = ThreeApp.CAMERA_PARAM.lookAt.clone()
      newTarget.x += x * -0.1 + y * 0.1
      newTarget.y += x * 0.1 + y * 0.1

      // イージングを使って、ゆっくり変化させる
      this.controls.target.x +=
        (newTarget.x - this.controls.target.x) * 0.1
      this.controls.target.y +=
        (newTarget.y - this.controls.target.y) * 0.1
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  updateWillChangeBoxes() {
    // willChangeBoxesの情報を元に、boxesを変更する
    for (const willChangeBox of this.willChangeBoxes) {
      const targetBox = this.boxes.find(
        (box) => box.uuid === willChangeBox.uuid
      )
      if (targetBox === undefined) {
        continue
      }
      // 現在のマテリアルの色が、willChangeBoxの色と異なる場合は変更する
      if (
        targetBox.material.color.getHex() !==
        willChangeBox.color
      ) {
        // イージングを使って、ゆっくり変化させる
        const diffColor = new THREE.Color(
          willChangeBox.color
        ) // ここでエラーが出る
        targetBox.material.color.r +=
          (diffColor.r - targetBox.material.color.r) * 0.2
        targetBox.material.color.g +=
          (diffColor.g - targetBox.material.color.g) * 0.2
        targetBox.material.color.b +=
          (diffColor.b - targetBox.material.color.b) * 0.2
        // targetBox.material.color.setHex(willChangeBox.color)
      }

      // 現在のy座標が、willChangeBoxのy座標と異なる場合は変更する
      // イージングを使って、ゆっくり変化させる
      const diffY = willChangeBox.y - targetBox.position.y
      targetBox.position.y += diffY * 0.02
    }
  }

  handleOnIntersect() {
    // マウスと交差しているオブジェクトの色を変える指令を出す
    if (this.mousePos !== null) {
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(this.mousePos, this.camera)
      const intersects = raycaster.intersectObjects(
        this.boxes
      )
      // 一旦全ての色を元に戻す
      for (const willChangeBox of this.willChangeBoxes) {
        // willChangeBox.colorが0xFFFFFFの場合は、変更しない
        if (
          willChangeBox.color === ThreeApp.hightlightColor
        ) {
          continue
        }
        willChangeBox.color = ThreeApp.MATERIAL_PARAM.color
      }
      // 交差しているオブジェクトの色を変える
      for (const intersect of intersects) {
        this.willChangeBoxes.find((willChangeBox) => {
          // willChangeBox.colorがThreeApp.hightlightColorの場合は、変更しない
          if (
            willChangeBox.color === ThreeApp.hightlightColor
          ) {
            return
          }
          if (
            willChangeBox.uuid === intersect.object.uuid
          ) {
            willChangeBox.color = 0xaaaaff
          }
        })
        break // 一つだけ変える
      }

      // マウスポインタが交差しているかどうかで、カーソルの形状を変える
      if (intersects.length > 0) {
        this.renderer.domElement.classList.add(
          'intersecting'
        )
      } else {
        this.renderer.domElement.classList.remove(
          'intersecting'
        )
      }
    }
  }

  setRandomYChange() {
    // 全てのboxesに対して、時間差を持たせてy座標を変更する
    for (const willChangeBox of this.willChangeBoxes) {
      window.setTimeout(() => {
        willChangeBox.y = 0.25
      }, willChangeBox.timeOffset * 300)
    }
  }
}
