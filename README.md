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

    ## Add to Cart Function

    ```ts
     increase: (item: OrderItem) => {
    set((state) => {
      const exist = state.items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? state.items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...state.items, { ...item, qty: 1 }];

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems);

      return {
        items: updatedCartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
    });
    },
    ```

6.  Create Menu component in header folder

## Handle Remove Item form Cart

```ts
decrease: (item: OrderItem) => {
    set((state) => {
      const exist = state.items.find((x) => x.slug === item.slug);
      if (!exist) return state;

      const updatedCartItems =
        exist.qty === 1
          ? state.items.filter((x) => x.slug !== item.slug)
          : state.items.map((x) =>
              x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x
            );

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems);

      return {
        items: updatedCartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
    });
  },
```

# Create Cart Page

1. lin/useCartService.ts

```ts
import { persist } from "zustand/middleware";
export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);
```

2. app/(frontend)//cart/cartDetails.ts

## Setup MongoDB Database using MongoDB Atlas or Local MongoDB

- Local MongoDB
  - Install MongoDB
  - Create .env file and add MONGODB_URI=mongodb://localhost/next-amazon
- OR Atlas Cloud MongoDB
  - Create database at MOngoDB Atlas
  - Create .env file, add MongoDB_URI=mongodb+srv://your-db-connection

## Load Products form DB

- lib/servrices/productServices.ts

```ts
import { cache } from "react";

import dbConnect from "../dbConnect";
import ProductModel, { Product } from "../models/ProductModel";

export const revalidate = 3600;

const getLatest = cache(async () => {
  await dbConnect();

  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(4)
    .lean();
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .limit(3)
    .lean();
  return products as Product[];
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return product as Product | null;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
};

export default productService;
```

- app(frontend)/pages.tsx

## Connect to Database

- lib/dbConnect.ts

```ts
import mongoose from "mongoose";
async function dbConnect() {
  try {
    console.log("Successfully connected to MongoDB.");
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.log("Connection error");
    throw new Error("Connection Failed!");
  }
}

export default dbConnect;
```

# Implement User Authentication

1. npm install next-auth@beta react-hook-form
2. .env

```env
AUTH_URL=http://localhost:3000
AUTH_SECRET=*******
```

3. lib/auth.ts

```ts
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";
import NextAuth from "next-auth";

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();
        if (credentials == null) return null;
        const user = await UserModel.findOne({ email: credentials.email });

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/register",
    error: "/signin",
  },
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth;
      return true;
    },

    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      }

      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
```

# Register User

1. app/api/auth/register/route.ts

```ts
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import UserModel from "@/lib/models/UserModel";

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return Response.json(
      { message: "New User has been Created." },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
```

# Create Shipping and Payment Page

1. lib/models/OrderModel.ts

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

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
```

2. lib/hooks/useCartStore.ts

```ts
saveShippingAddress: (shippingAddress: ShippingAddress) => {
  cartStore.setState({ shippingAddress });
};
savePaymentMethod: (paymentMethod: string) => {
  cartStore.setState({
    paymentMethod,
  });
};
```

3. components/CheckoutSteps.tsx

```ts
const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <li
            key={step}
            className={`step ${index <= current ? "step-primary" : " "}`}
          >
            {step}
          </li>
        )
      )}
    </ul>
  );
};

export default CheckoutSteps;
```

4. Create Shippping Form and Shipping Page

- app/frontend/shipping/Form.tsx
- app/frontend/shipping/page.tsx

```ts
import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
  title: "Shipping Address",
};
export default async function ShippingPage() {
  return <Form />;
}
```

5. app/frontend/payment/Form.tsx

- app/frontend/payment/page.tsx

```ts
import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
   title: "Payment Method"
}

export default async function PaymentPage() {
   return <Form />
```

# Place Order

1. lib/models/OrderModel.ts
2. app/api/orders/route.ts

3. npm install swr

- SWR is a React Hooks library for data fetching.
- With SWR, components will get a stream of data updates constantly and automatically. Thus, the UI will be always fast and reactive.

4. components/ClientProviders.tsx

- wrap the ClientProvider with <Swronfig>

```ts
<SWRConfig
  value={{
    onError: (error, key) => {
      toast.error(error.message);
    },
    fetcher: async (resource, init) => {
      const res = await fetch(resource, init);
      if (!res.ok) {
        throw new Error("An error occured while fetching the data.");
      }
      return res.json();
    },
  }}
>
  <Toaster />
  {children}
</SWRConfig>
```
