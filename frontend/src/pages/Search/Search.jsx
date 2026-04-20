import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";
import api from "@/utils/api";

const normalizeProduct = (product) => ({
  ...product,
  id: product._id ?? product.id,
  image: product.image || ProductImage,
  price: Number(product.price) || 0,
  rating: Number(product.averageRating ?? product.rating) || 0,
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
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 20px 80px",
        color: "#1f2937",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "14px" }}>검색</h1>
      <p style={{ fontSize: "18px", marginBottom: "28px" }}>{titleText}</p>

      {status === "loading" ? <p>검색 중입니다.</p> : null}
      {status === "error" ? <p>{errorMessage}</p> : null}
      {status === "success" && products.length === 0 ? (
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
      ) : null}

      {status === "success" && products.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCardVertical key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default Search;
