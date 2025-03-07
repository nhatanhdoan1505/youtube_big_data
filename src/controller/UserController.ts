import * as _ from "lodash";
import { UserService } from "../models/user/service";
import { IPayment, IUser } from "../models/user/type";
import { PaymentService } from "../utils/PaymentService";
import { ProfileService } from "../utils/ProfileService";
import express from "express";

export class UserController {
  private userService: UserService = new UserService();
  private profileService: ProfileService = new ProfileService();
  private paymentService: PaymentService = new PaymentService();

  async updateUser(req, res) {
    if (!req.body.user || !req.body.user.uid)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const { name, photoUrl, uid, email } = req.body.user;

    let user = await this.userService.findUser({ uid });

    if (user) {
      await this.userService.updateUser(
        { uid },
        { name, photoUrl, uid, email }
      );
      return res.status(200).json({ status: "OK", data: {} });
    }

    await this.userService.createUser({ name, photoUrl, uid, email });
    return res.status(200).json({ status: "OK", data: {} });
  }

  async getUserProfile(req, res) {
    if (!req.user)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let user: IUser[] = await this.userService.queryUser([
      { $match: { uid: req.user.uid } },
    ]);

    if (user.length === 0)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let userProfile = user[0];

    let { uid, ...userData } = userProfile;
    const { payment } = userProfile;
    let isPremium = false;
    if (payment.length > 0 && _.last(payment)) {
      let lastPayment: IPayment = _.last(payment);
      let extendDay = lastPayment.title === "MONTHLY" ? 30 : 365;
      let expired = new Date(
        lastPayment.date.getTime() + extendDay * 24 * 60 * 60 * 1000
      );
      isPremium = expired.getTime() >= Date.now() ? true : false;
    }

    return res
      .status(200)
      .json({ status: "OK", data: { userData: { ...userData, isPremium } } });
  }

  async updateUserProfile(req, res) {
    if (
      !req.body.channel ||
      (!req.body.competitorChannel && !_.isArray(req.body.competitorChannel))
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let { channel, competitorChannel } = req.body;

    let userChannelData = await this.profileService.getChannelSave(channel);
    let competitorChannelDataPromise = competitorChannel.map((c) =>
      this.profileService.getChannelSave(c.toString())
    );
    let competitorChannelData = (
      await Promise.all(competitorChannelDataPromise)
    ).filter((c) => c);

    await this.userService.updateUser(
      { uid: req.user.uid },
      {
        channel: userChannelData ? userChannelData : req.user.channel,
        competitorChannel: competitorChannelData,
      }
    );
    return res
      .status(200)
      .json({ status: "OK", data: { userChannelData, competitorChannelData } });
  }

  async createCheckoutLink(req, res) {
    try {
      const checkoutLink = await this.paymentService.createCheckoutLink({
        lineItem: [{ price: "price_1LE7keJ8XE3hrjLv1lcjfXKx", quantity: 1 }],
        uid: req.user.uid,
      });
      return res
        .status(200)
        .json({ status: "OK", data: { checkoutLink: checkoutLink.url } });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });
    }
  }

  async webHook(req, res) {
    let event = req.body;
    const signature = req.headers["stripe-signature"];
    event = await this.paymentService.constructEventWebhook({
      event,
      signature,
    });

    if (!event) return res.status(400);

    const { customer, payment_method, amount } = event.data.object;

    switch (event.type) {
      case "payment_intent.succeeded":
        const customerData = (await this.paymentService.getCustomerData({
          id: customer,
        })) as any;
        if (!customerData) break;

        const userData = await this.userService.findUser({
          email: customerData.email,
        });
        if (!userData) break;
        await this.userService.updateUser(
          { email: customerData.email },
          {
            payment: [
              {
                title: "MONTHLY",
                date: new Date(),
                method: payment_method ? payment_method : "CARD",
                price: amount,
              },
              ...userData.payment,
            ],
          }
        );
        break;
      case "payment_method.attached":
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event}`);
    }

    return res.json({ received: true });
  }
}
