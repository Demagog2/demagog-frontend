const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
    const truncatedText = text.substring(0, lastSpaceIndex);
  
    return truncatedText + '...';
  };
  
  export default truncate;