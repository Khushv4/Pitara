export const generateWhatsAppLink = (
  product
) => {
  const message =
    encodeURIComponent(
`Hi Pitara,

I'm interested in:

Product: ${product.title}

${product.show_price
  ? `Price: ₹${product.price}`
  : `Starting Price: ₹${product.starting_price}`}

Please share availability and details.

Thank you.`
    );

  return `https://wa.me/91YOURWHATSAPPNUMBER?text=${message}`;
};