import type { ShortUrl } from "@prisma/client";

const toDateString = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24 hour time
    };
    return date.toLocaleDateString(undefined, options);
};

interface AliasListItemProps {
    shortUrl: ShortUrl;
}

const AliasListItem = ({ shortUrl }: AliasListItemProps) => {
    const { slug, url, createdAt } = shortUrl;
    const host = `${window.location.host}/`;
    const creationDate = toDateString(new Date(createdAt));

    return (
        <div className="relative flex-col p-5
                        text-sm text-gray-500"
        >
            <p className="font-light">{creationDate}</p>
            <a href={url} className="inline-block w-full overflow-hidden whitespace-nowrap text-ellipsis">
                {url}
            </a>
            <div className="flex flex-row justify-between">
                <a href={slug} className="text-violet-500">
                    {host}
                    <span className="font-bold">{slug}</span>
                </a>
            </div>
        </div>
    );
};

export default AliasListItem;