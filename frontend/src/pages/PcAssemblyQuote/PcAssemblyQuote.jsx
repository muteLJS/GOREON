import "./PcAssemblyQuote.scss";
import PcAssemblyQuoteList from "@/components/PcAssemblyQuoteList/PcAssemblyQuoteList";
import CheckIcon from "@/assets/icons/check.svg";
import { analyzePcCompatibility } from "@/utils/pcCompatibility";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addQuoteItem,
  updateQuoteItemQuantity,
  removeQuoteItems,
  clearQuoteItems,
} from "@/store/slices/quoteSlice";
import {
  getPcAssemblyPerformanceChecks,
  getPcAssemblyRecommendations,
} from "@/utils/pcAssemblyProducts";

function PcAssemblyQuote({ isModal = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.quote.items);
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

  const compatibility = useMemo(() => analyzePcCompatibility(items), [items]);
  const performanceChecks = compatibility.checks;

  const recommendItems = useMemo(() => getPcAssemblyRecommendations(items), [items]);

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
    console.log("장바구니 담기", items);
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

    return `${product.category}-${product.id}-${randomId}`;
  };

  const handleRecommendAdd = (product) => {
    dispatch(
      addQuoteItem({
        id: createRecommendationQuoteId(product),
        productId: product.id,
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
          <div className={`pc-assembly-quote__compatibility-status is-${compatibility.level}`}>
            {compatibility.message}
          </div>
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
          TOTAL : ₩{totalPrice.toLocaleString("ko-KR")}
        </strong>

        <div className="pc-assembly-quote__right">
          <div className="pc-assembly-quote__insights">
            <section className="pc-assembly-quote__performance">
              <h3 className="pc-assembly-quote__section-title">성능 분석</h3>
              <div className="pc-assembly-quote__panel">
                {performanceChecks.length > 0 ? (
                  performanceChecks.map((row) => (
                    <div className="pc-assembly-quote__panel-item" key={row.id}>
                      <span className={`indicator indicator--${row.level}`} />
                      {row.text}
                    </div>
                  ))
                ) : (
                  <div className="pc-assembly-quote__panel-item">
                    <span className="indicator indicator--warning" />
                    부품을 선택하면 호환성 검사를 시작합니다.
                  </div>
                )}
              </div>
            </section>

            <section className="pc-assembly-quote__recommend">
              <h3 className="pc-assembly-quote__section-title">업그레이드 추천</h3>
              <div className="pc-assembly-quote__recommend-list">
                {recommendItems.map((item) => (
                  <article className="pc-assembly-quote__recommend-card" key={item.id}>
                    <div className="pc-assembly-quote__recommend-thumb">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="pc-assembly-quote__recommend-main">
                      <button
                        type="button"
                        className="pc-assembly-quote__recommend-name"
                        onClick={() => handleRecommendClick(item.id)}
                      >
                        {item.name}
                      </button>
                      <p className="pc-assembly-quote__recommend-meta">{item.option}</p>
                      <div className="pc-assembly-quote__recommend-bottom">
                        <strong className="pc-assembly-quote__recommend-price">
                          ₩{item.price.toLocaleString("ko-KR")}
                        </strong>
                        <button
                          type="button"
                          className="pc-assembly-quote__recommend-add"
                          onClick={() => handleRecommendAdd(item)}
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
