// this data structure is copied onto the client page and the copy is 
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin 
// cart total at checkout.
export const products = {
    'cherry-choco-chip-scone': {
        name: 'Cherry Chocolate Chip Scone',
        singular: 'scone',
        imageUrl: '/cherrychoco.jpg',
        amount: 0,
        details: 'A luscious cherry chocolate chip scone with a dusting of powdered sugar on top.',
        suggestedPrice: 3,
        mutualAid: true,
        batchCounts: [0, 6, 12, 18, 24]
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
    'earl-grey-scone': {
        name: 'Earl Grey Scone',
        singular: 'scone',
        imageUrl: '/earlgrey.jpg',
        amount: 0,
        details: 'Earl Grey Tea from Anahata Herbals in Duluth, baked into delicious scones with an Earl Grey glaze on top.',
        suggestedPrice: 3,
        mutualAid: true,
        batchCounts: [0, 6, 12, 18, 24]
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
        suggestedPrice: 5,
        mutualAid: false,
    }
};