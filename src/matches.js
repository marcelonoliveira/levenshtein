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

    get sequences() {
		let sequences = [];

		if (this.#matchCount === 0)
			return [{text: this.#target, match: false}];

		if (this.#matches[0] > 0)
			sequences.push({text: this.#target.slice(0, this.#matches[0]), match: false});

        for (let i = 0; i < this.#matches.length; i += 2) {
			const begin = this.#matches[i];
			const end = this.#matches[i + 1];
			sequences.push({text: this.#target.slice(begin, end + 1), match: true});

            if (end < (this.#target.length - 1))
                sequences.push({text: this.#target.slice(end + 1, this.#matches[i + 2]), match: false});
        }

		return sequences;
	}

	get count() {
		return this.#matchCount;
	}

	get target() {
		return this.#target;
	}
}