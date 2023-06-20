export const trimStr = (text, limit= 30) => {
    // Get the first 30 characters
    return cleanText(text).substring(0, limit);
}

export const cleanText = (text, limit= 30) => {
    // Remove HTML tags
    return text.replace(/<.*?>/g, '');
}