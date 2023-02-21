import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    getItem(key: string): any {
        return localStorage.getItem(key);
    }
}
