import { controller as config } from "../config.js";

export default class Controller {
  constructor(app) {
    this.app = app;
    this.hasClicked = false;
    this.firstClick = false; // reset // have to explain this?? no!
    this.mouse = {
      oldX: undefined,
      oldY: undefined,
      currX: undefined,
      currY: undefined,
    };
    this.moveX = 0;
    this.moveY = 0;
  }

  initialize() {
    document.body.addEventListener("mousedown", this.handleMD.bind(this));
    document.body.addEventListener("mousemove", this.handleMM.bind(this));
    document.body.addEventListener("mouseup", this.handleMU.bind(this));
    document.body.addEventListener("mouseleave", this.handleML.bind(this));
    document.body.addEventListener("keydown", this.handleKD.bind(this));
  }

  run() {
    if (
      !this.mouse.currX ||
      !this.mouse.currY ||
      !this.hasClicked ||
      !this.app.gameState["shake"]
    )
      return; // replace with "isactive" for efficiency
    if (
      (!this.mouse.oldX && this.mouse.currX) ||
      (!this.mouse.oldY && this.mouse.currY)
    ) {
      this.mouse.oldX = this.mouse.currX;
      this.mouse.oldY = this.mouse.currY;
      return;
    }

    const deltaX = this.mouse.currX - this.mouse.oldX;
    const deltaY = this.mouse.currY - this.mouse.oldY;

    this.moveX = deltaX;
    this.moveY = deltaY;

    this.mouse.oldX = this.mouse.currX;
    this.mouse.oldY = this.mouse.currY;
  }

  handleMD() {
    this.hasClicked = true;
    this.mouse.oldX = this.mouse.currX;
    this.mouse.oldY = this.mouse.currY;
  }

  handleMM(e) {
    if (this.hasClicked && !this.firstClick && this.app.gameState["shake"]) {
      this.firstClick = true;
      setTimeout(this.app.agent.handleReset.bind(this), config.shakeTime);
    }
    this.mouse.currX = e.clientX;
    this.mouse.currY = e.clientY;
  }

  handleMU() {
    this.hasClicked = false;
  }

  handleML() {
    this.hasClicked = false;
  }

  handleKD(e) {
    if (e.key === "Enter") {
      this.handleNameSubmit();
    }
    if (this.app.gameState["retry"] && e.key === " ") {
      this.app.reset();
    }
  }

  handleNameSubmit() {
    // rename because question too
    if (this.app.agent.inputBox.value.trim() !== "") {
      // could do more checks
      if (this.app.gameState["name"]) {
        this.app.playerName = this.app.agent.inputBox.value;
        this.app.agent.handleName();
      } else if (this.app.gameState["question"]) {
        this.app.question = this.app.agent.inputBox.value;
        this.app.agent.handleQuestion();
      }
    }
  }

  reset() {
    this.moveX = 0;
    this.moveY = 0;
    this.mouse = {
      oldX: undefined,
      oldY: undefined,
      currX: undefined,
      currY: undefined,
    };
    this.firstClick = false;
  }
}
