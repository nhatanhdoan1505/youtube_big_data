import { IUser } from "./../models/user/type";
import Stripe from "stripe";

interface ILineItem {
  price: string;
  quantity: number;
}

export class PaymentService {
  private endpointSecret: string = "whsec_04bWFidUSQI4RGLJMvfsCecSVaqRY66l";

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
        redirect: { url: "http://localhost:3000/thankyou" },
      },
      metadata: { uid },
      customer_creation: "always",
    });

    return paymentLink;
  }

  async createCustomer({ email }: IUser) {
    const customer = await this.stripe.customers.create({ email });
    return customer;
  }

  async getCustomerData({ id }: { id: string }) {
    try {
      const customer = await this.stripe.customers.retrieve(id);
      return customer;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async constructEventWebhook({ event, signature }) {
    if (this.endpointSecret) {
      try {
        event = this.stripe.webhooks.constructEvent(
          event,
          signature,
          this.endpointSecret
        );
        return event;
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return null;
      }
    }
  }
}
