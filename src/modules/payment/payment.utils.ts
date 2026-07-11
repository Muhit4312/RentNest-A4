import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {

    const rentalRequestId = session.metadata?.rentalRequestId;

    const tenantId = session.metadata?.tenantId;

    const transactionId = session.payment_intent as string;

    const amount = session.amount_total! / 100;

    if (!rentalRequestId || !tenantId) {
        throw new Error("Invalid Stripe metadata");
    }

    const payment = await prisma.payment.findUnique({

        where: {
            rentalRequestId
        }

    });


    if (payment) {

        return;

    }

    await prisma.$transaction(async (tx) => {

        await tx.payment.create({

            data: {

                rentalRequestId,
                tenantId,

                amount,

                provider: "STRIPE",

                status: "COMPLETED",

                transactionId,

                paidAt: new Date()

            }

        });

        await tx.rentalRequest.update({

            where: {
                id: rentalRequestId
            },

            data: {
                status: "COMPLETED"
            }

        });

        const rental = await tx.rentalRequest.findUniqueOrThrow({
            where: {
                id: rentalRequestId
            }
        });

        await tx.property.update({

            where: {
                id: rental.propertyId
            },

            data: {
                isAvailable: false
            }

        });


    });



}