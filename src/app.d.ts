// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currMonth?: number;
		}
		// interface PageData {}
		// interface Platform {}
	}

	type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
	type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

	interface Month {
		init: number;
		Block: {
			value: number;
		};
		Trans: {
			value: number;
		}[];
	}
}

export {};
