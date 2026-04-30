import ListLayout from "@/layouts/ListLayout/ListLayout";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { trackSelfDiscoveryShopping } from "@/utils/analytics";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setStatus("loading");
        setErrorMessage("");
        const result = await api.get("/products", {
          params: { keyword: query },
          signal: controller.signal,
        });
        setProducts(result.data.data);
        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError") return;
        setStatus("error");
        setErrorMessage("검색 결과를 불러오지 못했습니다.");
      }
    };
    if (query) {
      trackSelfDiscoveryShopping({
        signal: "search_results_view",
        source: "search_page",
        params: {
          query_length: query.length,
        },
      });
      fetchData();
    } else {
      setProducts([]);
      setStatus("success");
    }

    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <ListLayout
        filteredProducts={products}
        status={status}
        errorMessage={errorMessage}
        // searchLabel={`‘${query}’ `}
        searchLabel={`‘${query}’ `}
        searchLabelSpan={"에 대한 검색 결과입니다."}
      />
    </div>
  );
};

export default Search;
