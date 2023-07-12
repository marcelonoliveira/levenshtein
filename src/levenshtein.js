import { MOVE } from './move.js';
import { Matches } from './matches.js';

export class LevenshteinDistance {
	#source;
	#target;
	#treshold;
	#substitutionCost;
	#deletionCost;
	#insertionCost;
	#distanceMatrix;
	matches;

	constructor(
			source,
			target,
			threshold = 3,
			substitutionCost = 1,
			deletionCost = 1,
			insertionCost = 1,
			caseSensitive = false,
			ignoreAccents = true) {
		this.#treshold = threshold;
		this.#source = source;
		this.#target = target;
		this.#substitutionCost = substitutionCost;
		this.#deletionCost = deletionCost;
		this.#insertionCost = insertionCost;

		if (!caseSensitive) {
			this.#source = this.#source.toLowerCase();
			this.#target = this.#target.toLowerCase();
		}

		if (ignoreAccents) {
			this.#source = this.#source.normalize("NFD").replace(/\p{Diacritic}/gu, "");
			this.#target = this.#target.normalize("NFD").replace(/\p{Diacritic}/gu, "");
		}

		this.matches = new Matches(target);
		this.#getDistance();

		if (this.#distanceMatrix)
			this.#reconstruct();
	}

	#getDistance() {
		const rows = this.#source.length;
		const cols = this.#target.length;

		this.#distanceMatrix = new Array(rows + 1)
			.fill(0)
			.map(row => new Array(cols + 1).fill(0));

		for (let i = 1; i <= rows; i++)
			this.#distanceMatrix[i][0] = i;

		for (let j = 1; j <= cols; j++)
			this.#distanceMatrix[0][j] = j;

		for (let j = 1; j <= cols; j++) {

			for (let i = 1; i <= rows; i++) {
				const substitutionOrMatchCost = this.#source.charAt(i - 1) === this.#target.charAt(j - 1) ? 0 : this.#substitutionCost;
				this.#distanceMatrix[i][j] = Math.min(
					this.#distanceMatrix[i - 1][j] + this.#deletionCost,
					this.#distanceMatrix[i][j - 1] + this.#insertionCost,
					this.#distanceMatrix[i - 1][j - 1] + substitutionOrMatchCost);
			}
		}

		if (this.#distanceMatrix[rows][cols] > this.#treshold)
			this.#distanceMatrix = undefined;
	}

	#reconstruct() {
		let move = null;
		let i = this.#source.length;
		let j = this.#target.length;
		let result = '';

		while (i > 0 || j > 0) {

			if ((i > 0) && (j > 0)) {
				let above = this.#distanceMatrix[i - 1][j];
				let left = this.#distanceMatrix[i][j - 1];
				let diagonal = this.#distanceMatrix[i - 1][j - 1];

				if (diagonal <= above && diagonal <= left)
					move = MOVE.diagonal;
				else if (left <= above && left <= diagonal)
					move = MOVE.left;
				else
					move = MOVE.up;

			} else if (j === 0)
				move = MOVE.up;
			else if (i === 0)
				move = MOVE.left;

			if (move === MOVE.up)
				i--;
			else if (move === MOVE.left)
				j--;
			else {
				const match = this.#distanceMatrix[i - 1][j - 1] === this.#distanceMatrix[i][j];
				result = (match ? this.#target.charAt(j - 1) : 'S') + result;

				if (match)
					this.matches.update(j - 1);

				i--;
				j--;
			}
		}
	}
}