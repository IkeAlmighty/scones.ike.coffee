// this data structure is copied onto the client page and the copy is 
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin 
// cart total at checkout.
export const products = {
    'choco-chip-blueberry-scone': {
        name: 'Chocolate Chip Blueberry Scone',
        imageUrl: '/scone_16count.jpg',
        amount: 0,
        details: 'Chocolate chips and blueberries baked into delicious scones.',
        suggestedPrice: 3.5
    },
    'blueberry-lemon-scone': {
        name: 'Blueberry Lemon Scone',
        imageUrl: '/lemon-blueberry.jpg',
        amount: 0,
        details: 'Lemon zest and blueberries baked into delicious scones.',
        suggestedPrice: 3.5
    },
    'earl-grey-scone': {
        name: 'Earl Grey Scone',
        imageUrl: '',
        amount: 0,
        details: 'Earl Grey Tea from Anahata Herbals in Duluth, baked into delicious scones with an Earl Grey glaze on top.',
        suggestedPrice: 3.5
    },
    'delivery-fee': {
        name: 'Delivery Fee',
        amount: 0,
        suggestedPrice: 5
    }
};