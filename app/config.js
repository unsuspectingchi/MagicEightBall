// TODO:
// - Alphabetize (imports too)
// - make sure <80 chars
// load screen
// value of
// remove logs
// catch errors?? loading?
// help with shaking

export const agent = {
  inputBox: {
    placeholder: "What is your question?",
    topBefore: "49%",
    topAfter: "43%",
    widthBefore: "25%",
    widthAfter: "40%",
    leftBefore: "37.5%",
    leftAfter: "30%",
  },
  playAgainPrompt: "Press space to play again.",
};
export const app = {};
export const model = {
  geometries: {
    rad: 3,
    widthSeg: 30,
    heightSeg: 30,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI * 2,
  },
  ball: {
    resetRotY: 7.5,
    spinVel: 0.0002,
    moveVel: 0.0008,
    resetMoveVel: 0.01,
    resetSpinVel: 0.01,
    zoomVel: 0.005,
    shakeZ: -7,
    resetZ: 15,
    squareDivisor: 10,
    squareOffset: 20,
  },
  tetra: {
    zPos: 20,
    defaultRotX: 0.86,
    defaultRotY: 0.78,
    opacityInc: 0.001,
  },
};
export const view = {
  ball: {
    texUrl: "../../resources/8tex.png", // url from view perspective
    shine: 100,
    defaultRotY: 4.75,
    zoomZPos: -500,
  },
  tetra: {
    zPos: 17,
  },
  tetra: {
    responsesUrls: [
      "../../resources/responses/0.png",
      "../../resources/responses/1.png",
      "../../resources/responses/2.png",
      "../../resources/responses/3.png",
      "../../resources/responses/4.png",
      "../../resources/responses/5.png",
      "../../resources/responses/6.png",
      "../../resources/responses/7.png",
      "../../resources/responses/8.png",
      "../../resources/responses/9.png",
      "../../resources/responses/10.png",
      "../../resources/responses/11.png",
    ],
    texUrl: "../../resources/test.png", // url from view perspective
    shine: 100,
  },
  camera: {
    fov: 45,
    near: 1,
    far: 1000,
    zPos: 25,
  },
  light: {
    ambient: {
      color: 0xffffff,
      intensity: 0.5,
    },
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: {
        x: -1,
        y: 1,
        z: 0.5,
      },
    },
  },
  scene: {
    bgColor: 0x34293a,
  },
};
export const controller = {
  shakeTime: 4000,
};
