import { Pipe, PipeTransform,  } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  baseUrl = environment.baseUrl;
  transform(image: string | string[]): string {

    if(typeof image === 'string' && image.length > 0) {
      return `${this.baseUrl}/files/product/${image}`;
    } if (Array.isArray(image) && image.length > 0) {
      // Return the first image in the array
      return `${this.baseUrl}/files/product/${image[0]}`;
    } else {
      // Handle case where image is not a string or array
      console.warn('Invalid image format:', image);
      return './assets/images/no-image.jpg'; // Fallback image
    }
  }
}
