/**
 * Format a property's structured price ({ enquiryOnly, prefix, amount }) into
 * display text, e.g. "From $850,000" or "By Enquiry Only".
 */
export const formatListingPrice = (price) => {
    if (!price || price.enquiryOnly) return 'By Enquiry Only';
    if (price.amount == null) return 'Price on Application';
    const formatted = `$${Number(price.amount).toLocaleString('en-US')}`;
    return price.prefix ? `${price.prefix} ${formatted}` : formatted;
};
