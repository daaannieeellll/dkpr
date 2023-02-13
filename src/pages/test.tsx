import { api } from "../utils/api";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
} from "@fluentui/react-components";

const Test = () => {
    const { data: messages } = api.msgraph.getAllMessages.useQuery();
    const uniqueSenders = [...new Set(messages?.map((message) => message?.from?.emailAddress?.address))];
    uniqueSenders.sort((a, b) => {
        const aDomain = a?.split("@")[1]?.split(".").at(-2);
        const bDomain = b?.split("@")[1]?.split(".").at(-2);
        return aDomain && bDomain
            ? aDomain.localeCompare(bDomain)
            : a!.localeCompare(b!);
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Email</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {uniqueSenders.map((sender) => (
                    <TableRow key={sender}>
                        <TableCell>{sender}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Test;