import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Food, FoodCategory, SelectedProduct } from '../Models/Food';
import { LocalStorageService } from './local-storage.service';
import { StorageTerm } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable()
export class ProductService {
    readonly StorageTerm = StorageTerm;
    private product$ = new BehaviorSubject<SelectedProduct[]>([]);
    selectedProduct$ = this.product$.asObservable();

    constructor(
        private storage: LocalStorageService,
        private http: HttpClient,
        private notificationService: NotificationService,
    ) {
        const products: SelectedProduct[] = [...JSON.parse(this.storage.getItem(this.StorageTerm.AddedToCart)) ?? []];
        this.product$.next(products);
    }

    setProduct(product: SelectedProduct[]): void {
        this.product$.next(product);
    }

    getStoredProducts(): SelectedProduct[] {
        return JSON.parse(this.storage.getItem(this.StorageTerm.AddedToCart)) ?? [];
    }

    loadProducts(): Observable<Food[]> {
        const food = new Subject<Food[]>();
        this.http
            .get('/assets/data/products_data.csv', { responseType: 'text' })
            .subscribe(data => {
                const finalData = this.csvProductJSON(data.replaceAll('\r', ''));
                finalData.map(e => {
                    e.quantityAvailable = Number(e.quantityAvailable);
                    e.price = Number(e.price);
                    e.finalPrice = Number(e.finalPrice);
                });
                food.next(finalData);
            });
        return food;
    }

    csvProductJSON(csv): Food[] {
        const lines = csv.split('\n');

        const result: Food[] = [];

        // NOTE: If your columns contain commas in their values, you'll need
        // to deal with those before doing the next step
        // (you might convert them to &&& or something, then covert them back later)
        // jsfiddle showing the issue https://jsfiddle.net/
        const headers = lines[0].split(';');

        for (let i = 1; i < lines.length; i++) {

            const obj: Food = {};
            const currentLine = lines[i].split(';');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }

            result.push(obj);

        }

        //return result; //JavaScript object
        return result; //JSON
    }

    reduceProduct(item: SelectedProduct): void {
        const products: SelectedProduct[] = [...this.getStoredProducts()];
        const selectedProduct = products.find(e => e.id === item.id);
        if (selectedProduct.count === 1) {
            const updatedProductList = products.filter(e => e.id !== item.id);
            this.storage.setItem(this.StorageTerm.AddedToCart, JSON.stringify(updatedProductList));
            this.setProduct(updatedProductList);
        } else {
            selectedProduct.count -= 1;
            this.storage.setItem(this.StorageTerm.AddedToCart, JSON.stringify(products));
            this.setProduct(products);
        }
    }

    addProduct(item: SelectedProduct): void {
        this.loadProducts().subscribe(products => {
            const foundProduct = products.find(e => e.id === item.id);
            if (item.count === foundProduct.quantityAvailable) {
                this.notificationService.showNotification('danger', `There are only ${foundProduct.quantityAvailable} items available!`);
            } else {
                const products: SelectedProduct[] = [...this.getStoredProducts()];
                const selectedProduct = products.find(e => e.id === item.id);
                selectedProduct.count += 1;
                this.storage.setItem(this.StorageTerm.AddedToCart, JSON.stringify(products));
                this.setProduct(products);
            }
        });
        this.promotionBulkDrink();
    }

    promotionBulkDrink(): void {
        const products: SelectedProduct[] = [...this.getStoredProducts()];
        const drinks = products.filter(e => e.category === FoodCategory.Drinks);
        let drinksCount = 0;
        drinks.forEach(e => {
            drinksCount += e.count;
        });
        if (drinksCount >= 10) {
            this.applyPercentPromotion(FoodCategory.Drinks, 0.1);
        }
    }

    calculateTotalPrice(): number {
        let total = 0;
        const selectedProducts: SelectedProduct[] = [...this.getStoredProducts()];
        this.promotionBulkDrink();
        selectedProducts.forEach(e => {
            total += e.count * e.finalPriceToCalculate;
        });
        return this.applyValuePromotion(total);
    }

    applyPercentPromotion(category: (FoodCategory | string), value: number): void {
        const products: SelectedProduct[] = [...this.getStoredProducts()];
        const drinks = products.filter(e => e.category === FoodCategory.Drinks);
        drinks.forEach(e => {
            e.finalPriceToCalculate = e.finalPrice * (1 - value);
        });
        this.storage.setItem(this.StorageTerm.AddedToCart, JSON.stringify(products));
        this.setProduct(products);
    }

    applyValuePromotion(value: number): number {
        const selectedProducts: SelectedProduct[] = [...this.getStoredProducts()];
        const baking = selectedProducts.filter(e => e.category === FoodCategory.BakingCookingIngredients);
        let bakingTotalPrice = 0;
        baking.forEach(e => {
            bakingTotalPrice += e.finalPriceToCalculate * e.count;
        });
        if (bakingTotalPrice >= 50) {
            return value - 5;
        }
        return value;
    }

    applyPromotionCode(code: string): number {
        if (code === '20OFFPROMO') {
            return 20;
        }
        this.notificationService.showNotification('danger', `Invalid voucher!`);
        return 0;
    }
}
