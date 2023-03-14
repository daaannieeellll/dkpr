import { api } from "../utils/api";

const Test = () => {
  const { data: messages } = api.msgraph.getAllMessages.useQuery();
  const uniqueSenders = [
    ...new Set(
      messages?.map((message) => message?.from?.emailAddress?.address)
    ),
  ];
  uniqueSenders.sort((a, b) => {
    const aDomain = a?.split("@")[1]?.split(".").at(-2);
    const bDomain = b?.split("@")[1]?.split(".").at(-2);
    return aDomain && bDomain
      ? aDomain.localeCompare(bDomain)
      : a!.localeCompare(b!);
  });

  return uniqueSenders.map((sender, idx) => (
    <p key={idx} className="font-code text-white antialiased">
      {sender}
    </p>
  ));
};

export default Test;
