/* Number formats shared by the insight pages (en-AU). */

export const fmtInt = (n) => Math.round(n).toLocaleString('en-AU');

export const fmtAud = (n) => `$${fmtInt(n)}`;

/** "+14,718", "−2,416" (true minus sign), "0". */
export const fmtSigned = (n) => {
    const r = Math.round(n);
    if (r === 0) return '0';
    return `${r > 0 ? '+' : '−'}${Math.abs(r).toLocaleString('en-AU')}`;
};
