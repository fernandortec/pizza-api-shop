export class OrderCooldownExceededError extends Error {
	constructor() {
		super(
			"The order was placed too soon after the previous one. Please wait at least 5 minutes before trying again.",
		);
	}
}
