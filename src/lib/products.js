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
        imageUrl: '',
        amount: 0,
        details: 'Lemon zest and blueberries baked into delicious scones.',
        suggestedPrice: 3.5
    },
    'wild-plum-honey-scone': {
        name: 'Wild Plum & Honey Scone',
        imageUrl: '',
        amount: 0,
        details: 'Wild minnesotan grown plums baked into honey laced scones.',
        suggestedPrice: 3.5
    },
    'delivery-fee': {
        name: 'Delivery Fee',
        amount: 0,
        suggestedPrice: 5
    }
};