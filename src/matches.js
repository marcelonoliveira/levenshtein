export class Matches {
	#matches = [];
	#matchCount = [];
	#target;

	constructor(target) {
		this.#target = target;
	}

	update(position) {
		const beginOfSequence = !(this.#matches[0]) || (this.#matches[0] > position + 1);

		if (beginOfSequence) {
			this.#matches.unshift(position, position);
			this.#matchCount.unshift(1);
		} else {
			this.#matches[0] = position;
			this.#matchCount[0]++;
		}
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
		return this.#matchCount.reduce((accumulator, currentValue) => currentValue + accumulator, 0);
	}

	get longestMatch() {
		return this.#matchCount.reduce((accumulator, currentValue) => (currentValue > accumulator) ? currentValue : accumulator, 0);
	}

	get target() {
		return this.#target;
	}
}