import { writable } from "svelte/store";
import { products } from '$lib/products.js'

function stringifyCart(cart) {
    let cartString = '';
    Object.keys(cart).forEach((key) => {
        let product = cart[key];
        if (product.amount > 0) {
            cartString += `${product.name} x ${product.amount}\n`;
        }
    });

    return cartString;
}

function calcSuggestedPayment(cart) {
    let total = 0;
    Object.keys(cart).forEach((key) => {
        // products is used for price determination, because it is not client editable when accessed from backend server routes.
        // cart is a frontend copy of products that has been edited to reflect amount of each product desired by customer.
        total += products[key].suggestedPrice * cart[key].amount;
    });

    return total;
}

function calcMinSuggestedPayment(cart) {
    let total = 0;
    Object.keys(cart).forEach((key) => {
        // products is used for price determination, because it is not client editable when accessed from backend server routes.
        // cart is a frontend copy of products that has been edited to reflect amount of each product desired by customer.

        // only products marked with mutual-aid to the order, so I can honor partnerships:
        if (!products[key].mutualAid) {
            total += products[key].suggestedPrice * cart[key].amount;
        }
    });

    if (total < 0.5) total = 0.5; // minimum for stripe payments

    return total;
}

function validatePaymentAmount(cart, amount) {
    return amount >= calcMinSuggestedPayment(cart);
}

function generatePaymentLink(cart) {
    return `https://venmo.com/?txn=pay&audience=public&recipients=ike_kitchen&amount=${calcSuggestedPayment(cart)}&note=${stringifyCart(cart)}`;
}

function prettifyDate(date) {
    if (date) return `${date.getMonth() + 1} / ${date.getDate()}`;
    else return '- / -';
}

export { calcSuggestedPayment, calcMinSuggestedPayment, validatePaymentAmount, stringifyCart, generatePaymentLink, prettifyDate }