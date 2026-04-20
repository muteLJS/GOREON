import "./Search.scss";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";
import api from "@/utils/api";

const parseProductPrice = (price) => {
  const parsed = Number(String(price ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeProduct = (product) => ({
  ...product,
  id: product._id ?? product.id,
  image: product.image || ProductImage,
  price: parseProductPrice(product.price),
  rating: Number(product.rating) || 0,
});

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(query ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setStatus("idle");
        return;
      }

      try {
        setStatus("loading");
        setErrorMessage("");
        const response = await api.get("/products", {
          params: { keyword: query },
          signal: controller.signal,
        });
        setProducts((response.data.data ?? response.data ?? []).map(normalizeProduct));
        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        setStatus("error");
        setErrorMessage("검색 결과를 불러오지 못했습니다.");
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [query]);

  const titleText = useMemo(() => {
    if (!query) {
      return "검색어를 입력해 제품을 찾아보세요.";
    }

    return `"${query}" 검색 결과 ${products.length}개`;
  }, [products.length, query]);

  return (
    <main className="search-page">
      <h1 className="search-page__title">검색</h1>
      <p className="search-page__summary">{titleText}</p>

      {status === "loading" ? <p>검색 중입니다.</p> : null}
      {status === "error" ? <p>{errorMessage}</p> : null}
      {status === "success" && products.length === 0 ? (
        <div className="search-page__empty">
          검색 결과가 없습니다.
        </div>
      ) : null}

      {status === "success" && products.length > 0 ? (
        <div className="search-page__grid">
          {products.map((product) => (
            <ProductCardVertical key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default Search;
