import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const mockResults = [
  "MacBook Pro 14 M3",
  "LG gram Pro 16",
  "ROG Zephyrus G14",
  "Galaxy Book5 Pro 360",
];

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const filteredResults = useMemo(() => {
    if (!query) {
      return [];
    }

    return mockResults.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 20px 80px",
        color: "#1f2937",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "14px" }}>검색</h1>
      <p style={{ fontSize: "18px", marginBottom: "28px" }}>
        {query ? (
          <>
            <strong>{query}</strong> 검색 결과입니다.
          </>
        ) : (
          "검색어를 입력해 제품을 찾아보세요."
        )}
      </p>

      {query ? (
        filteredResults.length > 0 ? (
          <ul style={{ display: "grid", gap: "14px", padding: 0, listStyle: "none" }}>
            {filteredResults.map((item) => (
              <li
                key={item}
                style={{
                  padding: "18px 20px",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  borderRadius: "18px",
                  background: "#fff",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div
            style={{
              padding: "24px 20px",
              borderRadius: "18px",
              background: "#fff",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            검색 결과가 없습니다.
          </div>
        )
      ) : null}
    </main>
  );
}

export default Search;
