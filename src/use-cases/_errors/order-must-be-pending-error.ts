export class OrderMustBePendingError extends Error {
	constructor() {
		super(
			"You can only approve pending orders",
		);
	}
}
