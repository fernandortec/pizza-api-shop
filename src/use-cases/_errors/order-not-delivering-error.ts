export class OrderNotDelivering extends Error {
	constructor() {
		super('You cannot deliver orders that are not in "delivering" status.');
	}
}
