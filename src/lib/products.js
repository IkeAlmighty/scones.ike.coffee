// this data structure is copied onto the client page and the copy is 
// mutated. So I've added 'amount' field to allow the client a place to
// create a cart. the backend uses this structure unedited to determin 
// cart total at checkout.
export const products = {
    'blueberry-nutmeg-clementine-scone': {
        name: 'Blueberry Nutmeg with Clementine Glaze Scone',
        imageUrl: '/blueberry-nutmeg-clementine.jpg',
        amount: 0,
        details: 'A blueberry scone with ground nutmeg and clementine glaze on top.',
        suggestedPrice: 2.75,
        mutualAid: true,
    },
    'earl-grey-scone': {
        name: 'Earl Grey Scone',
        imageUrl: '/earlgrey.jpg',
        amount: 0,
        details: 'Earl Grey Tea from Anahata Herbals in Duluth, baked into delicious scones with an Earl Grey glaze on top.',
        suggestedPrice: 2.75,
        mutualAid: true,
    },
    'delivery-fee': {
        name: 'Delivery Fee',
        amount: 0,
        suggestedPrice: 5,
        mutualAid: false,
    }
};