import config from "../../config/env.config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createPaymentSession = async (rentalRequestId: string, tenantId: string) => {

    const transactionsResult = await prisma.$transaction(async (tx) => {

        const rental = await tx.rentalRequest.findUnique({
            where: {
                id: rentalRequestId
            },
            include: {
                property: true
            }
        });
        if (rental?.tenantId !== tenantId) {
            throw new Error("Unauthorized");
        }

        if (rental?.status !== "APPROVED") {
            throw new Error("Rental is not approved");
        }

        const payment = await tx.payment.findUnique({
            where: {
                rentalRequestId
            }
        })

        if (payment) {
            throw new Error("Payment already completed.");
        }

        const session = await stripe.checkout.sessions.create({



            line_items: [
                {

                    price_data: {

                        currency: "bdt",

                        product_data: {

                            name: rental.property.title,

                            description: rental.property.description

                        },

                        unit_amount: Number(rental.property.rent) * 100

                    },

                    quantity: 1

                }
            ],



            mode: "payment",

            payment_method_types: ["card"],

            success_url: `${config.app_url}/payment?success=true`,

            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: {

                rentalRequestId: rental.id,

                tenantId

            },

        });

        return session.url


    })


    return {
        paymentUrl: transactionsResult
    }

}


const confirmPaymentDB = async (payload: Buffer, signature: string) => {
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
    );

    switch(event.type){

    case "checkout.session.completed":

        await handleCheckoutCompleted(event.data.object);

        break;

    default:

        console.log(event.type);

}
}

const getMyPaymentsDB = async (tenantId: string) => {

    const payments = await prisma.payment.findMany({
        where: {
            tenantId
        },
        include: {
            rentalRequest: {
                include: {
                    property: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return payments;

}

export const paymentService = {
    createPaymentSession,
    confirmPaymentDB,
    getMyPaymentsDB

}