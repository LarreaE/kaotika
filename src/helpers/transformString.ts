
export const transformStringPlural = (str:string) => {
    if (str.length === 0) return str;  
    const firstLetterUpperCase = str.charAt(0).toUpperCase(); 
    const remainingString = str.slice(1, str.length - 1);
    return firstLetterUpperCase + remainingString;
}


export const transformStringSingular = (str:string) => {
    if (str.length === 0) return str;  
    const firstLetterUpperCase = str.charAt(0).toUpperCase(); 
    const remainingString = str.slice(1);
    return firstLetterUpperCase + remainingString;
}
