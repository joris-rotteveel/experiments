const SMALL = "small";
const MEDIUM = "medium";
const LARGE = "large";
const amountOfParticles = 2000;

class WordPlay {
  constructor() {
    this.inputs = [];
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x57bd84
    });
    document.body.appendChild(this.app.view);
    this.canvas = this.app.view;
    this.particles = [];
    this.angle = 0;
    this.indicators = [];

    this.onTicker = this.onTicker.bind(this);
    this.wordLoadingDone = this.wordLoadingDone.bind(this);
    this.explode = this.explode.bind(this);
    this.onExplosionDone = this.onExplosionDone.bind(this);
    this.updateHandIndicators = this.updateHandIndicators.bind(this);
    this.buildParticles();
    this.buildHandIndicators();
  }

  buildHandIndicators() {
    for (let index = 0; index < 12; index++) {
      const indicator = new Particle({
        texture: "circle.png",
        tint: 0xffffff
      });

      indicator.graphic.scale.set(0.3);
      this.app.stage.addChild(indicator.graphic);
      this.indicators.push(indicator);
    }
  }

  evalExplosion() {
    if (this.hasExploded) return;
    let total = 0;
    for (let p = 0; p < this.particles.length; p++) {
      const particle = this.particles[p];
      total += particle.movedFromInitialPos() ? 1 : 0;
    }
    if (total / this.particles.length > 0.6) {
      this.explode();
    }
  }

  linkHandToParticles(hand, shouldLink) {
    for (let p = 0; p < this.particles.length; p++) {
      const particle = this.particles[p];
      const difference = p5.Vector.sub(hand.position, particle.position);
      const dist = difference.mag();
      if (dist < 70 && shouldLink && !particle.hand) {
        particle.followHand(hand);
        TweenMax.to(particle, 1, {
          alpha: 0.3 + Math.random() * 0.4
        });
      } else if (!shouldLink && particle.hand === hand) {
        particle.followHand(null);
      }
    }
  }

  updateInput(inputs) {
    //check to see if one of the inputs
    this.inputs = inputs || [];

    for (let index = 0; index < this.indicators.length; index++) {
      const indicator = this.indicators[index];
      const isActive = index < this.inputs.length;
      indicator.graphic.alpha = isActive ? 0.8 : 0;
      if (this.hasExploded) {
        indicator.graphic.alpha = 0;
      }
      if (isActive && !this.hasExploded) {
        const input = this.inputs[index];
        // closed
        if (input.isClosed()) {
          indicator.graphic.tint = 0xff0000;
          indicator.graphic.scale.set(0.6);
          this.linkHandToParticles(input, true);
        } else if (input.isOpen()) {
          //open
          indicator.graphic.tint = 0xff0000;
          indicator.graphic.scale.set(0.3);
          this.linkHandToParticles(input, false);

          if (input.madeCloseToOpengesture()) {
            input.resetGesture();
            //place a bomb here?
          }
        }
        this.evalExplosion();
      }
    }
  }

  buildParticles() {
    this.sprites = new PIXI.particles.ParticleContainer(amountOfParticles, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    this.app.stage.addChild(this.sprites);
    this.app.ticker.add(this.onTicker);
    // create an array to store all the sprites
    for (let i = 0; i < amountOfParticles; i++) {
      var particle = new Particle({
        texture: "circle.png",
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });
      this.particles.push(particle);
      this.sprites.addChild(particle.graphic);
    }
  }

  getWordLength(word) {
    const length = word.length;
    const mediumMin = 20;
    if (length < mediumMin) return SMALL;
    return LARGE;
  }

  showWord({ word, time }) {
    this.isLoadingWord = true;
    this.hasExploded = false;
    this.explosionLoaded = false;
    const wordDetails = this.getPixelPositionsOfWord(word.toUpperCase(), 2);
    const coloredPixels = wordDetails.positions;
    const wordsWidth = wordDetails.width;
    const wordsHeight = wordDetails.height;
    const padding = 120;
    let scale = (window.innerWidth - padding * 2) / wordsWidth;
    let newHeight = scale * wordsHeight;
    if (newHeight > window.innerHeight - padding * 2) {
      scale = (window.innerHeight - padding * 2) / wordsHeight;
    }

    const step = Math.ceil(coloredPixels.length / amountOfParticles);
    const paddingX = window.innerWidth / 2 - (scale * wordsWidth) / 2;
    const paddingY = window.innerHeight / 2 - (scale * wordsHeight) / 2;
    const shapePoints = [];
    let colorIndex = 0;
    // spread the particles out over the available pixels
    for (var i = 0; i < this.particles.length; i++) {
      //if we have left overs, randomly position them on a pixel

      if (colorIndex + step < coloredPixels.length) {
        colorIndex += step;
        shapePoints.push(coloredPixels[colorIndex]);
      } else {
        const pixel =
          coloredPixels[Math.round(Math.random() * (coloredPixels.length - 1))];
        shapePoints.push(pixel);
      }
    }

    const wordLength = this.getWordLength(word);
    //position the particles on the shape
    for (let p = 0; p < this.particles.length; p++) {
      const particle = this.particles[p];
      // if we have all shapePoints covered, grab a random one
      const index =
        p < shapePoints.length
          ? p
          : Math.round(Math.random() * (shapePoints.length - 1));

      const offsetX = shapePoints[index].x + Math.cos(Math.random()) * 2;
      const offsetY = shapePoints[index].y + Math.sin(Math.random()) * 2;

      const x = offsetX * scale + paddingX;
      const y = offsetY * scale + paddingY;

      let particleScale;

      switch (wordLength) {
        case SMALL:
          particleScale = Math.random() * 0.3;
          break;
        default:
          // scaling logic - the longer the word, the smaller the scale
          const rangeMax = 1 - Math.min(1, word.length / 35);
          const baseScale = 0.5;
          const range = Math.max(baseScale, rangeMax - baseScale);
          particleScale = Math.min(1, 0.1 + Math.random() * range);
      }

      // particleScale = Math.random() * 0.2 + 0.2;
      particle.setBase({
        x: x,
        y: y,
        scale: particleScale
      });

      TweenMax.to(particle, 1, {
        scale: particleScale,
        alpha: Math.random() > 0.5 ? 0.8 : 1,
        x: x,
        y: y,
        onComplete:
          p === this.particles.length - 1 ? this.wordLoadingDone : null
      });
    }

    // this.autoRun = setTimeout(this.explode, time * 1000);
  }

  wordLoadingDone() {
    this.isLoadingWord = false;
  }

  explode() {
    this.hasExploded = true;
    const time = 1.5;
    TweenMax.delayedCall(time, this.onExplosionDone);
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      p.followHand(null);

      const center = createVector(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      TweenMax.to(p, time, { alpha: 0 });
      let force = p5.Vector.sub(center, p.position);
      force.normalize();
      force.mult(-200);
      p.applyForce(force);
    }
  }

  getColorAt(clip, x, y) {
    var pixels = this.app.renderer.extract.pixels(clip);
    //one dimensional array with R G B A (4)
    //convert this value to an index
    var index = (y * clip.width + x) * 4;
    //return the RGBA
    return {
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2],
      a: pixels[index + 3]
    };
  }

  getPixelPositionsOfWord(word, spacing) {
    let text = new PIXI.Text(word, {
      fontFamily: "Arial",
      fontSize: 20,
      letterSpacing: 2,
      fill: 0xff0000,
      align: "center",
      wordWrapWidth: 100,
      wordWrap: true
    });
    //set text
    this.app.stage.addChild(text);
    var w = text.width;
    var h = text.height;
    const positions = [];
    const step = word.length > 8 ? 2 : 1;
    for (let y = 0; y < h ; y += step) {
      for (let x = 0; x < w ; x += step) {
        const rgba = this.getColorAt(text, x, y);
        const alpha = rgba.a;
        if (alpha > 0) {
          positions.push({ x: x, y: y });
        }
      }
    }

    this.app.stage.removeChild(text);
    return { width: w, height: h, positions: positions };
  }

  onExplosionDone() {
    // Create the event.
    var event = document.createEvent("Event");

    // Define that the event name is 'build'.
    event.initEvent("wordDone", true, true);
    this.app.view.dispatchEvent(event);
  }

  updateHandIndicators() {
    for (let index = 0; index < this.inputs.length; index++) {
      const input = this.inputs[index];
      const indicator = this.indicators[index];
      indicator.graphic.x = input.position.x;
      indicator.graphic.y = input.position.y;
    }
  }

  onTicker(delta) {
    this.updateHandIndicators();

    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];
      if (particle.hand) {
        // debugger;
      }
      if (particle.hand && particle.hand.isClosed()) {
        // add Attractor/Spring here - that will look nicer
        let force = particle.hand.calculateAttraction(particle);
        particle.applyForce(force);
      }
      particle.update();
    }
  }
}
