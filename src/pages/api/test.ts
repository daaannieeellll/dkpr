import { getToken, } from "next-auth/jwt";
import { Client } from "@microsoft/microsoft-graph-client";

import type { NextApiRequest, NextApiResponse } from "next"
import { Message } from "@microsoft/microsoft-graph-types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = await getToken({
        req,
    });

    const accessToken = token?.accessToken;

    if (accessToken) {
        const client = Client.init({
            authProvider: (done) => done(null, accessToken),
        });

        interface Response { "@odata.context": string; "@odata.nextLink": string; value: Message[] };
        const { value, ...odata } = await client.api("/me/messages")
            .select([
                "subject",
                "from",
                "toRecipients",
            ])
            .top(1000)
            .skip(0)
            .get() as Response;

        let { "@odata.nextLink": nextLink } = odata;
        while (nextLink) {
            console.log(nextLink);
            const next: Response = await client.api(nextLink).get();
            value.push(...next.value);
            nextLink = next["@odata.nextLink"];
        }

        res.status(200).json(value);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}