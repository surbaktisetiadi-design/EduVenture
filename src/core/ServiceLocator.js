export class ServiceLocator {
  #services = new Map();

  register(name, instance) {
    if (this.#services.has(name)) {
      console.warn(`[ServiceLocator] Service "${name}" ditimpa.`);
    }
    this.#services.set(name, instance);
    return instance;
  }

  get(name) {
    if (!this.#services.has(name)) {
      throw new Error(`[ServiceLocator] Service "${name}" tidak ditemukan.`);
    }
    return this.#services.get(name);
  }

  has(name) {
    return this.#services.has(name);
  }
}