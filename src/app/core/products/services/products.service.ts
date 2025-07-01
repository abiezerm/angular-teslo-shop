import { ProductResponse } from './../types/product.type';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product } from "../types/product.type";
import { Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";

type Options = {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private productCache = new Map<string, ProductResponse>();

  get(options?: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = '' } = options || {};

    const key = `${limit}-${offset}-${gender}`;

    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
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
        tap((resp) => this.productCache.set(key, resp))
      );
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${slug}`);
  }
}
