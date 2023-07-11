export class Matches {
	#matches = [];
	#matchCount = 0;
	#target;

	constructor(target) {
		this.#target = target;
	}

	update(position) {
		const beginOfSequence = !(this.#matches[0]) || (this.#matches[0] > position + 1);

		if (beginOfSequence)
			this.#matches.unshift(position, position);
		else
			this.#matches[0] = position;

		this.#matchCount++;
	}

    get positions() {
		return [...(this.#matches)];
	}

	get count() {
		return this.#matchCount;
	}

	get target() {
		return this.#target;
	}
}