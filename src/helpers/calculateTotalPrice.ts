export const calculateTotalPrice = (items:any) =>
    items.reduce((total:any, item:any) => total + item.value, 0);