
import DOMPurify from 'dompurify';

export const sanitize = (dirty) => {
    if (typeof window === 'undefined') return dirty;
    return DOMPurify.sanitize(dirty);
};
