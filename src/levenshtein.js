import { MOVE } from './move.js';
import { Matches } from './matches.js';

const DEFAULT_THRESHOLD = 3;
const DEFAULT_SUBSTITUTION_COST = 1;
const DEFAULT_DELETION_COST = 1;
const DEFAULT_INSERTION_COST = 1;

export class LevenshteinDistance {
	#source;
	#target;
	#treshold;
	#substitutionCost;
	#deletionCost;
	#insertionCost;
	#distanceMatrix;
	#matches;

	constructor(source, target) {
		this.#source = source;
		this.#target = target;
		this.#treshold = DEFAULT_THRESHOLD;
		this.#substitutionCost = DEFAULT_SUBSTITUTION_COST;
		this.#deletionCost = DEFAULT_DELETION_COST;
		this.#insertionCost = DEFAULT_INSERTION_COST;
		this.#matches = new Matches(target);
	}

	withTreshold(value = 3) {
		this.#treshold = value;
		return this;
	}

	withSubstitutionCost(cost = DEFAULT_SUBSTITUTION_COST) {
		this.#substitutionCost = cost;
		return this;
	}

	withDeletionCost(cost = DEFAULT_DELETION_COST) {
		this.#deletionCost = cost;
		return this;
	}

	withInsertionCost(cost = DEFAULT_INSERTION_COST) {
		this.#insertionCost = cost;
		return this;
	}

	ignoringAccents(ignore = true) {

		if (ignore) {
			this.#source = this.#source.normalize("NFD").replace(/\p{Diacritic}/gu, "");
			this.#target = this.#target.normalize("NFD").replace(/\p{Diacritic}/gu, "");
		}

		return this;
	}

	ignoringCase(ignore = true) {

		if (ignore) {
			this.#source = this.#source.toLowerCase();
			this.#target = this.#target.toLowerCase();
		}

		return this;
	}

	calculate() {
		this.#getDistance();

		if (this.#distanceMatrix)
			this.#reconstruct();

		return this;
	}

	get matches() {
		return this.#matches;
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

		if ((this.#treshold >= 0) && (this.#distanceMatrix[rows][cols] > this.#treshold))
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
					this.#matches.update(j - 1);

				i--;
				j--;
			}
		}
	}
}