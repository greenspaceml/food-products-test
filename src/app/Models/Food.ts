export interface Food {
    id?: string;
    productName?: string;
    category?: FoodCategory;
    price?: number;
    finalPrice?: number;
    quantityAvailable?: number;
    priceUnit?: string;
}

export interface PromotionCode {
    id?: string;
    code?: string;
    amount?: number;
}

export enum FoodCategory {
    MeatAndPoultry= 'Meat & Poultry',
    FruitAndVegetables= 'Fruit & Vegetables',
    Drinks= 'Drinks',
    ConfectionaryAndDesserts= 'Confectionary & Desserts',
    BakingCookingIngredients= 'Baking/Cooking Ingredients',
    MiscellaneousItems= 'Miscellaneous Items',
}

export interface SelectedProduct {
    productName: string;
    id: string;
    count: number;
    category: FoodCategory;
    finalPrice: number;
    finalPriceToCalculate: number;
    priceUnit: string;
}
