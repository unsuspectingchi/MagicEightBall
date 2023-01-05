import { model as config } from "../config.js";

export default class Model {
  constructor(app) {
    this.app = app;
    this.geometries = {
      ball: undefined,
      tetra: undefined,
    };
    this.change = {
      x: undefined,
      y: undefined,
    };
    this.ballDecrease = 1;

    this.hasResetXMove = false;
    this.hasResetYMove = false;
    this.hasResetXSpin = false;
    this.hasResetYSpin = false;
  }

  initialize() {
    this.geometries.ball = new THREE.SphereGeometry(
      config.geometries.rad,
      config.geometries.widthSeg,
      config.geometries.heightSeg,
      config.geometries.phiStart,
      config.geometries.phiLength,
      config.geometries.thetaStart,
      config.geometries.thetaLength
    );
    this.geometries.tetra = new THREE.TetrahedronGeometry();
  }

  zoomBall(timeDelta) {
    if (!this.app.view.meshes.ball.material.opacity) {
      this.app.view.meshes.ball.material.opacity = 1;
    }
    if (this.app.view.meshes.ball.position.z < config.ball.shakeZ) {
      this.ballDecrease = Math.pow(
        Math.abs(
          this.app.view.meshes.ball.position.z / config.ball.squareDivisor
        ),
        2
      );
      this.app.view.meshes.ball.position.z +=
        config.ball.zoomVel * this.ballDecrease * timeDelta;
    } else {
      this.app.agent.handleShake();
    }
  }

  shakeBall(timeDelta) {
    let decreaseX = 1;
    let decreaseY = 1;
    if (this.app.view.meshes.ball.position.x) {
      decreaseX =
        Math.pow(Math.abs(this.app.view.meshes.ball.position.x), 4) + 1;
    }
    if (this.app.view.meshes.ball.position.y) {
      decreaseY =
        Math.pow(Math.abs(this.app.view.meshes.ball.position.y), 4) + 1;
    }

    const spinVelX = config.ball.spinVel * this.app.controller.moveY; // swapped
    const spinVelY = config.ball.spinVel * this.app.controller.moveX; // swapped

    this.app.view.meshes.ball.rotation.x += timeDelta * spinVelX;
    this.app.view.meshes.ball.rotation.y += timeDelta * spinVelY;

    this.change.x =
      this.app.controller.moveX *
      timeDelta *
      config.ball.moveVel *
      (1 / (decreaseX + 1));
    this.change.y =
      -this.app.controller.moveY *
      timeDelta *
      config.ball.moveVel *
      (1 / (decreaseY + 1));

    this.app.controller.moveX = 0;
    this.app.controller.moveY = 0;

    this.app.view.meshes.ball.position.x += this.change.x;
    this.app.view.meshes.ball.position.y += this.change.y;
  }

  run(timeDelta) {
    if (this.app.gameState["appear"]) {
      this.zoomBall(timeDelta);
    }
    if (this.app.gameState["shake"]) {
      this.shakeBall(timeDelta);
    }
    if (this.app.gameState["reset"]) {
      this.resetBall(timeDelta);
    }
    if (this.app.gameState["reveal"]) {
      this.showTetra(timeDelta);
    }
    if (this.app.gameState["retry"]) {
    }
  }

  reset() {
    this.hasResetXMove = false;
    this.hasResetYMove = false;
    this.hasResetXSpin = false;
    this.hasResetYSpin = false;
  }

  showTetra(timeDelta) {
    if (this.app.view.meshes.tetra.material.opacity > 1) {
      this.app.agent.handleRetry();
    }

    this.app.view.meshes.tetra.position.z = config.tetra.zPos;
    this.app.view.meshes.tetra.rotation.x = config.tetra.defaultRotX;
    this.app.view.meshes.tetra.rotation.y = config.tetra.defaultRotY;

    this.app.view.meshes.tetra.material.opacity +=
      timeDelta * config.tetra.opacityInc;
  }

  // this function is terrible and if i had all the time in the world i would
  // devote every second into rewriting it but i dont so im not
  resetBall(timeDelta) {
    if (
      this.hasResetXMove &&
      this.hasResetYMove &&
      this.hasResetXSpin &&
      this.hasResetYSpin &&
      this.app.view.meshes.ball.position.z > config.ball.resetZ
    ) {
      this.app.agent.handleReveal();
    }

    // Move Z
    if (this.app.view.meshes.ball.position.z < config.ball.resetZ) {
      this.ballDecrease = Math.pow(
        Math.abs(
          (this.app.view.meshes.ball.position.z - config.ball.squareOffset) /
            config.ball.squareDivisor
        ),
        2
      );
      this.app.view.meshes.ball.position.z +=
        config.ball.zoomVel * 3 * this.ballDecrease * timeDelta;
    }

    // Move X, Y
    if (!this.hasResetXMove) {
      if (this.app.view.meshes.ball.position.x < 0) {
        // Move X Pos
        this.app.view.meshes.ball.position.x +=
          config.ball.resetMoveVel * timeDelta;
        if (this.app.view.meshes.ball.position.x >= 0) {
          this.app.view.meshes.ball.position.x = 0;
          this.hasResetXMove = true;
        }
      } else {
        // Move X Neg
        this.app.view.meshes.ball.position.x -=
          config.ball.resetMoveVel * timeDelta;
        if (this.app.view.meshes.ball.position.x <= 0) {
          this.app.view.meshes.ball.position.x = 0;
          this.hasResetXMove = true;
        }
      }
    }
    if (!this.hasResetYMove) {
      if (this.app.view.meshes.ball.position.y < 0) {
        // Move Y Pos
        this.app.view.meshes.ball.position.y +=
          config.ball.resetMoveVel * timeDelta;
        if (this.app.view.meshes.ball.position.x >= 0) {
          this.app.view.meshes.ball.position.y = 0;
          this.hasResetYMove = true;
        }
      } else {
        // Move Y Neg
        this.app.view.meshes.ball.position.y -=
          config.ball.resetMoveVel * timeDelta;
        if (this.app.view.meshes.ball.position.x <= 0) {
          this.app.view.meshes.ball.position.y = 0;
          this.hasResetYMove = true;
        }
      }
    }

    // Spin X, Y
    if (!this.hasResetXSpin) {
      if (this.app.view.meshes.ball.rotation.x < 0) {
        // Spin X Pos
        this.app.view.meshes.ball.rotation.x +=
          config.ball.resetSpinVel * timeDelta;
        if (this.app.view.meshes.ball.rotation.x >= 0) {
          this.app.view.meshes.ball.rotation.x = 0;
          this.hasResetXSpin = true;
        }
      } else {
        // Spin X Neg
        this.app.view.meshes.ball.rotation.x -=
          config.ball.resetSpinVel * timeDelta;
        if (this.app.view.meshes.ball.rotation.x <= 0) {
          this.app.view.meshes.ball.rotation.x = 0;
          this.hasResetXSpin = true;
        }
      }
    }

    if (!this.hasResetYSpin) {
      if (this.app.view.meshes.ball.rotation.y < config.ball.resetRotY) {
        // Spin Y Pos
        this.app.view.meshes.ball.rotation.y +=
          config.ball.resetSpinVel * timeDelta;
        if (this.app.view.meshes.ball.rotation.y >= config.ball.resetRotY) {
          this.app.view.meshes.ball.rotation.y = config.ball.resetRotY;
          this.hasResetYSpin = true;
        }
      } else {
        // Spin Y Neg
        this.app.view.meshes.ball.rotation.y -=
          config.ball.resetSpinVel * timeDelta;
        if (this.app.view.meshes.ball.rotation.y <= config.ball.resetRotY) {
          this.app.view.meshes.ball.rotation.y = config.ball.resetRotY;
          this.hasResetYSpin = true;
        }
      }
    }
  }
}
