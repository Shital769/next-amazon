import { create } from "zustand";
import { round2 } from "../utils";
import { OrderItem } from "../models/OrderModel";

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

export const cartStore = create<Cart & { increase: (item: OrderItem) => void }>((set) => ({
  ...initialState,
  increase: (item: OrderItem) => {
    set((state) => {
      const exist = state.items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? state.items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...state.items, { ...item, qty: 1 }];

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);

      return {
        items: updatedCartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
    });
  },
}));

export default function useCartService() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice, increase } = cartStore((state) => ({
    items: state.items,
    itemsPrice: state.itemsPrice,
    taxPrice: state.taxPrice,
    shippingPrice: state.shippingPrice,
    totalPrice: state.totalPrice,
    increase: state.increase,
  }));
  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase,
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(Number(0.15 * itemsPrice)),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
