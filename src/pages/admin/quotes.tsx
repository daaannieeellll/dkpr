import AdminLayout from "../../components/layouts/admin";
import { api } from "../../utils/api";
import { NextPageWithLayout } from "../_app";

const isMatchingDate = (date: Date, id: number) =>
  date.getMilliseconds() === id &&
  date.getSeconds() === 0 &&
  date.getMinutes() === 0 &&
  date.getHours() === 1;

const getDateString = (date: Date, id?: number) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  if (id && isMatchingDate(date, id)) {
    delete options.day;
    delete options.month;
  }

  return date.toLocaleDateString("nl-NL", options);
};

function getCurrentPosition(options = {}) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const QuotesPage: NextPageWithLayout = () => {
  const { data: quotes } = api.quotes.getAllQuotes.useQuery();
  const createQuote = api.quotes.createQuote.useMutation();

  return (
    <>
      <section className="font-code text-white">
        <h2 className="text-lg font-medium">Create a new quote</h2>
        <form
          className="flex flex-col gap-2"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const author = formData.get("author") as string;
            const quote = formData.get("quote") as string;
            const {
              coords: { latitude, longitude },
            } = await getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });

            if (author && quote) {
              createQuote.mutate({ author, quote, latitude, longitude });
            }
            window.location.reload();
          }}
        >
          <label htmlFor="author">Author</label>
          <input
            type="text"
            name="author"
            id="author"
            className="bg-neutral-900"
          />

          <label htmlFor="quote">Quote</label>
          <textarea
            name="quote"
            id="quote"
            className="bg-neutral-900"
            rows={5}
          />
          <button type="submit">Commit</button>
        </form>
      </section>

      <section className="font-code text-sm font-light text-white">
        <h2 className="text-lg font-medium">Quotes</h2>
        <div className="divide-y divide-neutral-800">
          {quotes &&
            quotes
              .map((item) => {
                const { id, quote, author, createdAt } = item;
                const dateString = getDateString(createdAt, id - 1);

                return (
                  <>
                    <p key={id} className="py-3">
                      {`${id}. "${quote}" -${author.name}, ${dateString}`}
                    </p>
                  </>
                );
              })
              .reverse()}
        </div>
      </section>
    </>
  );
};

QuotesPage.getLayout = (page: React.ReactNode) => (
  <AdminLayout>{page}</AdminLayout>
);
export default QuotesPage;
