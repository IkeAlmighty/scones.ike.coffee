// this data structure is copied onto the client page and the copy is 
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin 
// cart total at checkout.
export const products = {
    'cherry-choco-chip-scone': {
        name: 'Cherry Chocolate Chip Scone',
        imageUrl: '',
        amount: 0,
        details: 'A luscious cherry chocolate chip scone with vanilla icing.',
        suggestedPrice: 3.25,
        mutualAid: true
    },
    'blueberry-scone': {
        name: 'Blueberry Scone',
        imageUrl: '/blueberry.jpg',
        amount: 0,
        details: 'A classic blueberry scone.',
        suggestedPrice: 3.25,
        mutualAid: true,
    },
    'earl-grey-scone': {
        name: 'Earl Grey Scone',
        imageUrl: '/earlgrey.jpg',
        amount: 0,
        details: 'Earl Grey Tea from Anahata Herbals in Duluth, baked into delicious scones with an Earl Grey glaze on top.',
        suggestedPrice: 3.25,
        mutualAid: true,
    },
    'delivery-fee': {
        name: 'Delivery Fee',
        amount: 0,
        suggestedPrice: 5,
        mutualAid: false,
    }
};