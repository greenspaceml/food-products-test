import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectedProduct } from '../../Models/Food';
import { LocalStorageService } from '../../services/local-storage.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
    location: Location;
    selectedProduct: SelectedProduct[];
    constructor(
        private storage: LocalStorageService,
        private productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.productService.selectedProduct$.subscribe((value) => {
            this.selectedProduct = value;
        });
    }
}
