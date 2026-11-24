export class GameLoop {
  #fixedStep = 1 / 60;
  #accumulator = 0;
  #running = false;
  #last = 0;
  #handlers = { update: [], fixedUpdate: [], render: [] };

  onUpdate(fn)      { this.#handlers.update.push(fn); }
  onFixedUpdate(fn) { this.#handlers.fixedUpdate.push(fn); }
  onRender(fn)      { this.#handlers.render.push(fn); }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#last = performance.now();
    requestAnimationFrame(this.#tick);
  }

  stop() {
    this.#running = false;
  }

  #tick = (now) => {
    if (!this.#running) return;

    const delta = Math.min((now - this.#last) / 1000, 0.1);
    this.#last = now;

    this.#accumulator += delta;
    while (this.#accumulator >= this.#fixedStep) {
      this.#handlers.fixedUpdate.forEach((fn) => fn(this.#fixedStep));
      this.#accumulator -= this.#fixedStep;
    }

    this.#handlers.update.forEach((fn) => fn(delta));
    this.#handlers.render.forEach((fn) => fn(delta));

    requestAnimationFrame(this.#tick);
  };
}