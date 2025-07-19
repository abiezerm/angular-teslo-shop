import { Gender, ProductResponse } from './../types/product.type';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product } from "../types/product.type";
import { Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from '@core/auth/types';

type Options = {
  limit?: number;
  offset?: number;
  gender?: string;
}

  const emptyProduct: Product = {
    id: 'new',
    title: '',
    description: '',
    price: 0,
    images: [],
    stock: 0,
    sizes: [],
    slug: '',
    gender: Gender.Men,
    tags: [],
    user: {} as User
  }

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private productsCache = new Map<string, ProductResponse>();
  private productCache = new Map<string, Product>();



  get(options?: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = '' } = options || {};

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductResponse>(`${this.baseUrl}/products`, {
        params: {
          ...(limit && { limit }),
          ...(offset && { offset }),
          ...(gender && { gender }),
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${slug}`);
  }

  getById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if(this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http
      .get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(id, product)));
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/products/${id}`, product)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);
    this.productsCache.forEach((response) => {
      response.products = response.products.map((currentProduct) =>
        currentProduct.id === productId ? product : currentProduct
      );
    });
  }
}
