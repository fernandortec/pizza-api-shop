export class OrderAlreadyDispatchedError extends Error {
	constructor() {
		super("You cannot cancel an order, after it has been dispatched");
	}
}
