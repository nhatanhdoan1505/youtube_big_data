import { IUser } from "./../models/user/type";
import Stripe from "stripe";

interface ILineItem {
  price: string;
  quantity: number;
}

export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: "2020-08-27",
  });

  async createCheckoutLink({
    lineItem,
    uid,
  }: {
    lineItem: ILineItem[];
    uid: string;
  }) {
    const paymentLink = await this.stripe.paymentLinks.create({
      line_items: lineItem,
      after_completion: {
        type: "redirect",
        redirect: { url: "http://localhost:3000" },
      },
      metadata: { uid },
    });

    return paymentLink;
  }

  async createCustomer({ email }: IUser) {
    const customer = await this.stripe.customers.create({ email });
    return customer;
  }
}
