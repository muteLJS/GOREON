import { useEffect, useState } from "react";

import { fetchProductCatalog } from "@/api/products";

function useProductCatalog() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setStatus("loading");
        setErrorMessage("");
        const nextProducts = await fetchProductCatalog();

        if (!isMounted) {
          return;
        }

        setProducts(nextProducts);
        setStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setStatus("error");
        setErrorMessage(error.message || "상품 목록을 불러오지 못했습니다.");
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    status,
    errorMessage,
  };
}

export default useProductCatalog;
