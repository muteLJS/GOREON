import "./PcAssemblyQuote.scss";
import PcAssemblyQuoteList from "@/components/PcAssemblyQuoteList/PcAssemblyQuoteList";
import CheckIcon from "@/assets/icons/check.svg";
import ProductImage from "@/assets/products/product-example.jpg";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeQuoteItems, clearQuoteItems } from "@/store/slices/quoteSlice";

function PcAssemblyQuote({ isModal = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.quote.items);
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const Root = isModal ? "div" : "main";

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const performanceChecks = useMemo(
    () => [
      { id: 1, text: "CPU 대비 GPU 성능 부족", level: "warning" },
      { id: 2, text: "RAM 용량 충분", level: "ok" },
    ],
    [],
  );

  const recommendItems = useMemo(
    () => [
      {
        id: 1001,
        name: "AMD 라이젠7 9700X",
        option: "기본 옵션",
        price: 1000,
        image: ProductImage,
      },
      {
        id: 1002,
        name: "FSP HYDRO G PRO 850W",
        option: "기본 옵션",
        price: 1000,
        image: ProductImage,
      },
      {
        id: 1003,
        name: "SK하이닉스 P41 2TB",
        option: "기본 옵션",
        price: 1000,
        image: ProductImage,
      },
    ],
    [],
  );

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    dispatch(removeQuoteItems(selectedIds));
    setSelectedIds([]);
  };

  const handleClear = () => {
    dispatch(clearQuoteItems());
    setSelectedIds([]);
  };

  const handleCompatibilityCheck = () => {
    console.log("호환성 검사");
  };

  const handleAddCart = () => {
    console.log("장바구니 담기", items);
  };

  const handleRecommendClick = (productId) => {
    navigate(`/product/${productId}`);
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
            onSelectItem={handleSelectItem}
          />
        </section>

        <section className="pc-assembly-quote__compatibility">
          <div className="pc-assembly-quote__compatibility-count">
            <img src={CheckIcon} alt="체크" />
            부품 {items.length}개 선택
          </div>
          <div className="pc-assembly-quote__compatibility-status">호환성 모두 이상 없음</div>
          <button
            className="pc-assembly-quote__compatibility-check"
            type="button"
            onClick={handleCompatibilityCheck}
          >
            호환성 검사
          </button>
        </section>

        <strong className="pc-assembly-quote__total">
          TOTAL : ₩{totalPrice.toLocaleString("ko-KR")}
        </strong>

        <div className="pc-assembly-quote__right">
          <section className="pc-assembly-quote__performance">
            <h3 className="pc-assembly-quote__section-title">성능 분석</h3>
            <div className="pc-assembly-quote__panel">
              {performanceChecks.map((row) => (
                <div className="pc-assembly-quote__panel-item" key={row.id}>
                  <span className={`indicator indicator--${row.level}`} />
                  {row.text}
                </div>
              ))}
            </div>
          </section>

          <section className="pc-assembly-quote__recommend">
            <h3 className="pc-assembly-quote__section-title">업그레이드 추천</h3>
            <div className="pc-assembly-quote__panel pc-assembly-quote__recommend-list">
              {recommendItems.map((item) => (
                <button
                  type="button"
                  className="pc-assembly-quote__recommend-card"
                  key={item.id}
                  onClick={() => handleRecommendClick(item.id)}
                >
                  <div className="pc-assembly-quote__recommend-thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="pc-assembly-quote__recommend-main">
                    <div className="pc-assembly-quote__recommend-name">{item.name}</div>
                    <p className="pc-assembly-quote__recommend-meta">{item.option}</p>
                    <strong className="pc-assembly-quote__recommend-price">
                      ₩{item.price.toLocaleString("ko-KR")}
                    </strong>
                  </div>
                </button>
              ))}
            </div>
          </section>

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
