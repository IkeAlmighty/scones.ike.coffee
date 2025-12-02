// this data structure is copied onto the client page and the copy is
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin
// cart total at checkout.
export const products = {
	'tea-blend-hll': {
		name: "Lemony Hibiuscus (Andy's Foraged Tea)",
		singular: 'tea bag',
		amount: 0,
		details: 'A hand-foraged blend of hibiscus, lemon balm, and lemongrass.',
		suggestedPrice: 1,
		mutualAid: true,
		batchCounts: [0, 1, 3, 5, 10, 15, 20]
	},
	'tea-blend-mlb': {
		name: "Bergamot Blend (Andy's Foraged Tea)",
		singular: 'tea bag',
		amount: 0,
		details: 'A hand-foraged blend of mullein, lemongrass, and bergamot.',
		suggestedPrice: 1,
		mutualAid: true,
		batchCounts: [0, 1, 3, 5, 10, 15, 20]
	},
	'blueberry-scone': {
		name: 'Blueberry Scone',
		singular: 'scone',
		imageUrl: '/blueberry.jpg',
		amount: 0,
		details: 'A classic blueberry scone.',
		suggestedPrice: 3,
		mutualAid: true,
		batchCounts: [0, 6, 12, 18, 24]
	},
	'surpise-scone': {
		name: 'Surprise Flavor!',
		singular: 'scone',
		imageUrl: '/mystery-flavor.jpg',
		amount: 0,
		details:
			'Whatever I feel like baking! If you are allergic to something, let me know in the notes.',
		suggestedPrice: 3,
		mutualAid: true,
		batchCounts: [0, 6, 12, 18, 24]
	},

	'delivery-fee': {
		name: 'Delivery Fee',
		amount: 0,
		suggestedPrice: 5,
		mutualAid: false
	}
};
