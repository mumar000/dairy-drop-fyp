import Stripe from "stripe"
import { env } from "../config/env.js"

if(!env.STRIPE_SECRET_KEY) {
    throw new Error("Missing secrets");
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover"
})