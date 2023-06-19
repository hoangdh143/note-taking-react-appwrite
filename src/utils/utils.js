export const trimStr = (text, limit= 30) => {
    // Remove HTML tags
    var cleanedText = text.replace(/<.*?>/g, '');

    // Get the first 30 characters
    return cleanedText.substring(0, limit);
}