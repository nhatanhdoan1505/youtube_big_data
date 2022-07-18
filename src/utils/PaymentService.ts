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
    return this.stripe.paymentLinks.create({
      line_items: lineItem,
      after_completion: {
        type: "redirect",
        redirect: { url: `http://${process.env.SERVER_ADDRESS}:3000/thankyou` },
      },
      metadata: { uid },
      customer_creation: "always",
    });
  }

  async createCustomer({ email }: IUser) {
    return this.stripe.customers.create({ email });
  }

  async getCustomerData({ id }: { id: string }) {
    try {
      return await this.stripe.customers.retrieve(id);
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
