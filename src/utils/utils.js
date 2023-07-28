export const trimStr = (text, limit= 30) => {
    // Get the first 30 characters
    return cleanText(text).substring(0, limit);
}

export const cleanText = (text, limit= 30) => {
    // Remove HTML tags
    return text.replace(/<.*?>/g, '');
}

export const formatDateToMMDDYYYY = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
}

export const TODAY = new Date();

export const getThreeDaysLater = () => {
    const threeDaysLater = new Date(TODAY);
    threeDaysLater.setDate(TODAY.getDate() + 3);
    return formatDateToMMDDYYYY(threeDaysLater);
}