// THREE is ThreeJS library, linked globally... Would rewrite structure if I
//   open-sourced this project, but for a personal thing I'm fine with
//   carrying a global like this

import Controller from "./controller/Controller.js";
import Model from "./model/Model.js";
import View from "./view/View.js";
import Agent from "./agent/Agent.js";
import { app as config } from "./config.js"; // not neccessary

export default class App {
  constructor() {
    this.timePrior;
    this.isRunningGame = false;
    this.playerName = "";
    this.question = ""; // reset
    this.animation;

    this.gameState = {
      name: true,
      question: false,
      appear: false,
      shake: false,
      reset: false, // better name
      reveal: false,
      retry: false,
    };

    this.model = new Model(this);
    this.view = new View(this);
    this.controller = new Controller(this);
    this.agent = new Agent(this);

    this.initialize();
  }

  initialize() {
    this.agent.initialize(); // first!
    this.model.initialize();
    this.view.initialize(this.model);
    this.controller.initialize();

    this.agent.run();
  }

  run() {
    this.timePrior = 0;
    this.isRunningGame = true;
    this.animation = requestAnimationFrame(this.loopStart.bind(this));
  }

  loopStart(timeNow) {
    this.timePrior = timeNow;
    const that = this; // if you have ever worked in JS, you know what this is
    this.animation = requestAnimationFrame(loop);

    function loop(timeNow) {
      if (!that.isRunningGame) return;

      const timeDelta = timeNow - that.timePrior;

      that.model.run(timeDelta);
      that.view.run();
      that.controller.run();

      that.timePrior = timeNow;
      that.animation = requestAnimationFrame(loop);
    }
  }

  reset() {
    this.isRunningGame = false;
    this.question = "";
    console.log("here-------------------" + this.isRunningGame);
    this.agent.reset();
    this.model.reset();
    this.view.reset();
    this.controller.reset();
    window.cancelAnimationFrame(this.animation);
    this.model.run(0);
    this.view.run();
    this.controller.run();
  }
}
