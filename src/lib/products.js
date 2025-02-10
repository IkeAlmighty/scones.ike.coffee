// this data structure is copied onto the client page and the copy is 
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin 
// cart total at checkout.
export const products = {
    'choco-chip-blueberry-scone': {
        name: 'Chocolate Chip Blueberry Scone',
        singular: 'scone',
        imageUrl: '/scone_16count.jpg',
        amount: 0,
        details: 'Chocolate chips and blueberries baked into delicious scones.',
        suggestedPrice: 2.75,
        batchCounts: [0, 3, 6, 12, 24]
    },
    'blueberry-lemon-scone': {
        name: 'Blueberry Lemon Scone',
        singular: 'scone',
        imageUrl: '/lemon-blueberry.jpg',
        amount: 0,
        details: 'Lemon zest and blueberries baked into delicious scones.',
        suggestedPrice: 2.75,
        batchCounts: [0, 3, 6, 12, 24]
    },
    'earl-grey-scone': {
        name: 'Earl Grey Scone',
        singular: 'scone',
        imageUrl: '/earlgrey.jpg',
        amount: 0,
        details: 'Earl Grey Tea from Anahata Herbals in Duluth, baked into delicious scones with an Earl Grey glaze on top.',
        suggestedPrice: 2.75,
        batchCounts: [0, 3, 6, 12, 24]
    },
    'wesley-andrews-coffee': {
        name: "Whole Bean Coffee by Wesley Andrews",
        singular: 'bag',
        imageUrl: '/WA_ETH_KAYON.png',
        amount: 0,
        details: 'Kayon Mountain Natural Ethiopian Coffee.',
        suggestedPrice: 17.00,
        mutualAid: false,
        batchCounts: [0, 1]
    },
    'delivery-fee': {
        name: 'Delivery Fee',
        amount: 0,
        suggestedPrice: 5
    }
};