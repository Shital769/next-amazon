# My Next Amazon App

## Features

- Product listing with search and filter options
- Shopping cart functionality
- User authentication and account management
- Responsive design

## Created Next Amazon App by using npx create-next-app@latest on Terminal and Published to Github.

## List the Products:

1.  Create product type
2.  Add details
3.  Add images
4.  Render products

## Create Product Details

1.  Create product page
2.  Create 3 columns
3.  Show images in first column
4.  Show prduct info in second column
5.  show add to cart action on third column
6.  add styles

## Handle Add To Cart

1.  lib/utils.ts

    ```ts
    export const round2 = (num: number) =>
      Math.round((num + Number.EPSILON) * 100) / 100;
    ```

2.  lib/models/OrderModel.ts

    ```ts
    export type OrderItem = {
      name: string;
      slug: string;
      qty: number;
      image: string;
      price: number;
      color: string;
      size: string;
    };
    ```

3.  npm install zustand
4.  Create a Hook: lib/hooks/userCartStore.ts
5.  Create AddToCart component
6.  Create Menu component in header folder

## Handle Remove Item form Cart
