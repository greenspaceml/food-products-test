import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { ProductService } from '../services/product.service';
import { SelectedProduct } from '../Models/Food';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
    carts: SelectedProduct[] = [];

    promotionCode: string;

    totalAmount: number;

    constructor(
        private storage: LocalStorageService,
        private productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.productService.selectedProduct$.subscribe((value) => {
            this.carts = value;
        });
        this.calculateTotalPrice();
    }

    onReduceItem(item: SelectedProduct): void {
        this.productService.reduceProduct(item);
    }

    onAddItem(item: SelectedProduct): void {
        this.productService.addProduct(item);
    }

    calculateItemTotalPrice(item: SelectedProduct): number {
        return item.count * item.finalPrice;
    }

    calculateTotalPrice(): void {
        this.totalAmount = this.productService.calculateTotalPrice();
    }

    onApplyPromotion(): void {
        this.totalAmount = this.productService.calculateTotalPrice() - this.productService.applyPromotionCode(this.promotionCode);
    }
}
