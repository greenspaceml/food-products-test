import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food, SelectedProduct } from '../Models/Food';
import { StorageTerm } from '../constants/constants';
import { LocalStorageService } from '../services/local-storage.service';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
    readonly StorageTerm = StorageTerm;
    food: Food[];

    constructor(
        private http: HttpClient,
        private storage: LocalStorageService,
        private productService: ProductService,
        private notificationService: NotificationService,
    ) {
    }

    ngOnInit() {
        this.productService.loadProducts().subscribe(e => {
            this.food = e;
        });
    }

    onAddToCard(item: Food): void {
        if (item.quantityAvailable === 0) {
            this.notificationService.showNotification('danger', `This item is currently out of stock!`);
        } else {
            const products: SelectedProduct[] = [...this.productService.getStoredProducts()];
            if (this.isProductSelected(item.id)) {
                const storedProduct = products.find(e => e.id === item.id);
                storedProduct.count += 1;
            } else {
                const newProduct: SelectedProduct = {
                    productName: item.productName,
                    category: item.category,
                    finalPrice: Number(item.finalPrice),
                    priceUnit: item.priceUnit,
                    id: item.id,
                    finalPriceToCalculate: item.finalPrice,
                    count: 1,
                };
                products.push(newProduct);
            }
            this.storage.setItem(this.StorageTerm.AddedToCart, JSON.stringify(products));
            this.productService.setProduct(products);
        }
    }

    isProductSelected(id: string): boolean {
        const currentData: SelectedProduct[] = [...this.productService.getStoredProducts()];
        return currentData.some(e => e.id === id);
    }
}
