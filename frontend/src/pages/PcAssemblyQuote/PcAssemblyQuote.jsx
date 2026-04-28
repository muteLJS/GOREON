import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CheckIcon from "@/assets/icons/check.svg";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import PcAssemblyQuoteList from "@/components/PcAssemblyQuoteList/PcAssemblyQuoteList";
import { useToast } from "@/components/Toast/toastContext";
import useProductCatalog from "@/hooks/useProductCatalog";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addQuoteItem,
  clearQuoteItems,
  removeQuoteItems,
  updateQuoteItemQuantity,
} from "@/store/slices/quoteSlice";
import {
  getPcAssemblyPerformanceChecks,
  getPcAssemblyRecommendations,
} from "@/utils/pcAssemblyProducts";
import { normalizeImageUrl } from "@/utils/image";
import "./PcAssemblyQuote.scss";

function PcAssemblyQuote({ isModal = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const items = useSelector((state) => state.quote.items);
  const { products } = useProductCatalog();
  const [selectedIds, setSelectedIds] = useState([]);
  const [analysisIds, setAnalysisIds] = useState([]);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const Root = isModal ? "div" : "main";

  const getItemQuantity = (item) => Number(item.quantity) || 1;
  const totalPrice = items.reduce((sum, item) => sum + item.price * getItemQuantity(item), 0);
  const selectedCount = selectedIds.length;
  const hasSelectedItems = selectedCount > 0;
  const selectedItemSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const analysisItemSet = useMemo(() => new Set(analysisIds), [analysisIds]);
  const analyzedItems = useMemo(
    () => items.filter((item) => selectedItemSet.has(item.id) && analysisItemSet.has(item.id)),
    [items, selectedItemSet, analysisItemSet],
  );
  const hasAnalyzedItems = analyzedItems.length > 0;

  const performanceChecks = useMemo(
    () => getPcAssemblyPerformanceChecks(analyzedItems, products),
    [analyzedItems, products],
  );

  const visiblePerformanceChecks = useMemo(() => {
    const textSet = new Set();

    return performanceChecks.filter((row) => {
      if (textSet.has(row.text)) {
        return false;
      }

      textSet.add(row.text);
      return true;
    });
  }, [performanceChecks]);

  const compatibilityLevelMap = useMemo(
    () => new Map(performanceChecks.map((row) => [row.id, row.level])),
    [performanceChecks],
  );

  const compatibilityStatus = useMemo(() => {
    if (!performanceChecks.length) {
      return null;
    }

    if (performanceChecks.some((row) => row.level === "error")) {
      return { level: "error", text: "호환성 확인 필요" };
    }

    if (performanceChecks.some((row) => row.level === "warning")) {
      return { level: "warning", text: "일부 부품 확인 필요" };
    }

    return { level: "ok", text: "호환성 모두 이상 없음" };
  }, [performanceChecks]);

  const recommendItems = useMemo(
    () => getPcAssemblyRecommendations(items, products),
    [items, products],
  );

  useEffect(() => {
    const itemIds = new Set(items.map((item) => item.id));
    setSelectedIds((prev) => prev.filter((id) => itemIds.has(id)));
    setAnalysisIds((prev) => prev.filter((id) => itemIds.has(id)));
  }, [items]);

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
    setAnalysisIds([]);
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
    setAnalysisIds([]);
  };

  const handleDeleteSelected = () => {
    dispatch(removeQuoteItems(selectedIds));
    setSelectedIds([]);
    setAnalysisIds([]);
  };

  const handleClear = () => {
    dispatch(clearQuoteItems());
    setSelectedIds([]);
    setAnalysisIds([]);
  };

  const handleCompatibilityCheck = () => {
    setAnalysisIds(selectedIds);
  };

  const handleAddCart = () => {
    if (items.length === 0) {
      showToast("장바구니에 담을 상품이 없습니다.");
      return;
    }

    items.forEach((item) => {
      dispatch(
        addToCart({
          id: item.id,
          productId: item.productId ?? item._id ?? item.id,
          _id: item._id ?? item.productId ?? item.id,
          category: item.category ?? "상품",
          name: item.name ?? "상품명",
          option: item.option ?? item.spec ?? "기본 옵션",
          price: Number(item.price) || 0,
          image: item.image ?? item.heroImage ?? "",
          quantity: getItemQuantity(item),
        }),
      );
    });

    showToast(`장바구니에 ${items.length}개 상품을 담았습니다.`);
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(updateQuoteItemQuantity({ id: item.id, quantity: getItemQuantity(item) - 1 }));
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(updateQuoteItemQuantity({ id: item.id, quantity: getItemQuantity(item) + 1 }));
  };

  const handleRecommendClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const createRecommendationQuoteId = (product) => {
    const randomId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return `${product.category}-${product._id}-${randomId}`;
  };

  const handleRecommendAdd = (product, event) => {
    event?.stopPropagation();

    dispatch(
      addQuoteItem({
        id: createRecommendationQuoteId(product),
        _id: product._id,
        productId: product._id,
        category: product.category,
        name: product.name,
        option: product.option,
        price: product.price,
        quantity: 1,
        image: product.image,
        rating: product.rating,
        compatibility: "ok",
        status: "ok",
      }),
    );
  };

  return (
    <Root className={`pc-assembly-quote ${isModal ? "pc-assembly-quote--modal" : ""}`}>
      {!isModal && <h2 className="pc-assembly-quote__title">견적 리스트</h2>}

      <div className="pc-assembly-quote__layout">
        <section className="pc-assembly-quote__list">
          <div className="pc-assembly-quote__control">
            <label className="pc-assembly-quote__select-all">
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              <span className="pc-assembly-quote__checkbox-mark" />
              <span>전체선택</span>
            </label>
            <button
              className="pc-assembly-quote__delete-button"
              type="button"
              onClick={handleDeleteSelected}
            >
              삭제
            </button>
          </div>

          <PcAssemblyQuoteList
            productList={items}
            selectedIds={selectedIds}
            compatibilityLevels={compatibilityLevelMap}
            onSelectItem={handleSelectItem}
            onDecreaseQuantity={handleDecreaseQuantity}
            onIncreaseQuantity={handleIncreaseQuantity}
          />
        </section>

        <section className="pc-assembly-quote__compatibility">
          <div className="pc-assembly-quote__compatibility-count">
            <img src={CheckIcon} alt="체크" />
            부품 {selectedCount}개 선택
          </div>
          {compatibilityStatus && (
            <div
              className={`pc-assembly-quote__compatibility-status pc-assembly-quote__compatibility-status--${compatibilityStatus.level}`}
            >
              {compatibilityStatus.text}
            </div>
          )}
          <button
            className="pc-assembly-quote__compatibility-check"
            type="button"
            onClick={handleCompatibilityCheck}
            disabled={!hasSelectedItems}
          >
            호환성 검사
          </button>
        </section>

        <strong className="pc-assembly-quote__total">
          TOTAL : {totalPrice.toLocaleString("ko-KR")}원
        </strong>

        <div className="pc-assembly-quote__right">
          <div className="pc-assembly-quote__insights">
            <section className="pc-assembly-quote__performance">
              <h3 className="pc-assembly-quote__section-title">성능 분석</h3>
              <div className="pc-assembly-quote__panel">
                {hasAnalyzedItems ? (
                  visiblePerformanceChecks.map((row) => (
                    <div className="pc-assembly-quote__panel-item" key={row.id}>
                      <span className={`indicator indicator--${row.level}`} />
                      {row.text}
                    </div>
                  ))
                ) : hasSelectedItems ? (
                  <div className="pc-assembly-quote__panel-empty">
                    호환성 검사를 누르면 성능 분석이 표시됩니다.
                  </div>
                ) : (
                  <div className="pc-assembly-quote__panel-empty">
                    부품을 체크하면 성능 분석이 표시됩니다.
                  </div>
                )}
              </div>
            </section>

            <section className="pc-assembly-quote__recommend">
              <h3 className="pc-assembly-quote__section-title">업그레이드 추천</h3>
              <div className="pc-assembly-quote__recommend-list">
                {recommendItems.map((item) => (
                  <article className="pc-assembly-quote__recommend-card" key={item._id}>
                    <div className="pc-assembly-quote__recommend-thumb">
                      <img
                        src={normalizeImageUrl(item.image) || ProductHeroImage}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = ProductHeroImage;
                        }}
                      />
                    </div>
                    <div className="pc-assembly-quote__recommend-main">
                      <button
                        type="button"
                        className="pc-assembly-quote__recommend-name"
                        onClick={() => handleRecommendClick(item._id)}
                      >
                        {item.name}
                      </button>
                      <p className="pc-assembly-quote__recommend-meta">{item.option}</p>
                      <div className="pc-assembly-quote__recommend-bottom">
                        <strong className="pc-assembly-quote__recommend-price">
                          {item.price.toLocaleString("ko-KR")}원
                        </strong>
                        <button
                          type="button"
                          className="pc-assembly-quote__recommend-add"
                          onClick={(event) => handleRecommendAdd(item, event)}
                        >
                          담기
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="pc-assembly-quote__action">
            <button
              className="pc-assembly-quote__action-button pc-assembly-quote__action-button--secondary"
              type="button"
              onClick={handleClear}
            >
              초기화
            </button>
            <button
              className="pc-assembly-quote__action-button"
              type="button"
              onClick={handleAddCart}
            >
              장바구니 담기
            </button>
          </section>
        </div>
      </div>
    </Root>
  );
}

export default PcAssemblyQuote;
