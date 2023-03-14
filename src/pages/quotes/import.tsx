import { useCallback } from "react";
import { api } from "../../utils/api";

const toDate = (year: number, idx: number) => {
  const date = new Date(0);
  date.setUTCFullYear(year);
  date.setUTCMilliseconds(idx);
  return date;
};

const ImportQuotesPage = () => {
  const importQuotes = api.quotes.importQuotes.useMutation();

  const onsubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const quotes = text.split("\n").map((line, id) => {
          const [_, quote, author, year] = line.split(";");
          if (!quote || !author || !year) {
            throw new Error(`Invalid line: ${line}`);
          }
          return {
            quote,
            author,
            createdAt: toDate(parseInt(year), id),
          };
        });
        importQuotes.mutate(quotes);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div>
      <h1>Import Quotes</h1>
      <form onSubmit={(e) => onsubmit(e)}>
        <label htmlFor="file">File</label>
        <input type="file" name="file" id="file" />
        <button type="submit">Import</button>
      </form>
    </div>
  );
};

export default ImportQuotesPage;
