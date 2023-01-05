import { agent as config } from "../config.js";

export default class Agent {
  // Handles transitions between game states and game state changing
  constructor(app) {
    this.app = app;
    this.inputBox;
    this.title;
    this.greeting;
    this.playAgain;
  }

  initialize() {
    this.inputBox = document.getElementsByClassName("inputBox")[0];
    this.title = document.getElementsByClassName("title")[0];
    this.greeting = document.getElementsByClassName("greeting")[0];
    this.playAgain = document.getElementsByClassName("play-again")[0];
  }

  run() {
    // rename??
    this.inputBox.style.top = config.inputBox.topBefore;
    this.inputBox.style.opacity = 1;
    this.title.style.opacity = 1;
  }

  handleName() {
    this.app.gameState["name"] = false;
    this.app.gameState["question"] = true;
    this.title.style.opacity = 0;
    this.inputBox.placeholder = config.inputBox.placeholder;
    this.inputBox.value = "";
    this.inputBox.style.top = config.inputBox.topAfter;
    this.inputBox.style.width = config.inputBox.widthAfter;
    this.inputBox.style.left = config.inputBox.leftAfter;
    this.greeting.style.opacity = 1;
    this.greeting.innerText = "Hello " + this.app.playerName + "!"; // random new greeting?
  }

  handleQuestion() {
    this.inputBox.style.opacity = 0;
    this.greeting.style.opacity = 0;
    setTimeout(() => {
      this.app.run();
      this.app.gameState["question"] = false; // would use enum
      this.app.gameState["appear"] = true;
      this.inputBox.value = "";
      this.inputBox.placeholder = config.inputBox.placeholder;
      this.inputBox.style.top = config.inputBox.topBefore;
      this.inputBox.style.width = config.inputBox.widthBefore;
      this.inputBox.style.left = config.inputBox.leftBefore;
      this.app.gameState["retry"] = false;
      this.app.gameState["question"] = true;
    }, 1500); // fadeout delay
  }

  handleShake() {
    this.app.gameState["appear"] = false;
    this.app.gameState["shake"] = true;
  }

  handleReset() {
    this.app.gameState["shake"] = false; // no two game state ever true + set by agent
    this.app.gameState["reset"] = true;
  }

  handleReveal() {
    this.app.gameState["reset"] = false;
    this.app.gameState["reveal"] = true;
  }

  handleRetry() {
    this.app.gameState["reveal"] = false;
    this.playAgain.innerText = config.playAgainPrompt;
    this.playAgain.style.opacity = 1;
    this.app.gameState["retry"] = true;
  }

  reset() {
    this.playAgain.style.opacity = 0;
    setTimeout(() => {
      this.inputBox.style.opacity = 1;
      this.inputBox.style.display = "block";
      this.inputBox.value = "";
      this.inputBox.placeholder = config.inputBox.placeholder;
      this.inputBox.style.top = config.inputBox.topBefore;
      this.inputBox.style.width = config.inputBox.widthBefore;
      this.inputBox.style.left = config.inputBox.leftBefore;
      this.greeting.style.opacity = 1;
      this.app.gameState["retry"] = false;
      this.app.gameState["question"] = true;
      this.inputBox.style.top = config.inputBox.topAfter;
      this.inputBox.style.width = config.inputBox.widthAfter;
      this.inputBox.style.left = config.inputBox.leftAfter;
    }, 1000);
  }
}
