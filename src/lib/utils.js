import { writable } from "svelte/store";

function stringifyCart(products) {
    let cartString = '';
    Object.keys(products).forEach((key) => {
        let product = products[key];
        if (product.amount > 0) {
            cartString += `${product.name} x ${product.amount}, \n`;
        }
    });

    return cartString;
}

function calcSuggestedPayment(products) {
    let total = 0;
    Object.keys(products).forEach((key) => {
        total += products[key].suggestedPrice * products[key].amount;
    });

    return total;
}

function generatePaymentLink(products) {
    return `https://venmo.com/?txn=pay&audience=public&recipients=ike_kitchen&amount=${calcSuggestedPayment(products)}&note=${stringifyCart(products)}`;
}

export { calcSuggestedPayment, stringifyCart, generatePaymentLink }