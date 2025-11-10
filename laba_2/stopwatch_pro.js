class Stopwatch {
    #startTime = 0;
    #elapsedMs = 0;
    #isRunning = false;
    #laps = [];

    start() {
        if (this.#isRunning) return;
        this.#startTime = Date.now();
        this.#isRunning = true;
    }

    pause() {
        if (!this.#isRunning) return;
        this.#elapsedMs += Date.now() - this.#startTime;
        this.#isRunning = false;
    }

    resume() {
        if (this.#isRunning) return;
        this.#startTime = Date.now();
        this.#isRunning = true;
    }

    reset() {
        this.#startTime = 0;
        this.#elapsedMs = 0;
        this.#isRunning = false;
        this.#laps = [];
    }

    lap() {
        const totalTime = this.getTime();
        const lastLap = this.#laps[this.#laps.length - 1];
        const delta = lastLap ? totalTime - lastLap.timeMs : totalTime;

        this.#laps.push({
            id: this.#laps.length + 1,
            timeMs: totalTime,
            deltaMs: delta
        });
    }

    getTime() {
        return this.#isRunning
            ? this.#elapsedMs + (Date.now() - this.#startTime)
            : this.#elapsedMs;
    }

    getLaps() {
        return this.#laps.map(lap => ({ ...lap }));
    }

    static format(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }
}