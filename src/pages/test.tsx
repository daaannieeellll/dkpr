import { api } from "../utils/api";

const Test = () => {
    const { data: messages } = api.msgraph.getAllMessages.useQuery();
    const uniqueSenders = [...new Set(messages?.map((message) => message?.from?.emailAddress?.address))];
    uniqueSenders.sort((a, b) => {
        const aDomain = a?.split("@")[1];
        const bDomain = b?.split("@")[1];
        return aDomain && bDomain
            ? aDomain.localeCompare(bDomain)
            : a!.localeCompare(b!);
    });

    return (
        <div>
            <pre>{JSON.stringify(uniqueSenders, null, 2)}</pre>
        </div>
    );
};

export default Test;