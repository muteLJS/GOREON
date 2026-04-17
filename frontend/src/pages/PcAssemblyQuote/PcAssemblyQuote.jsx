import "./PcAssemblyQuote.scss";
import PcAssemblyQuoteList from "@/components/PcAssemblyQuoteList/PcAssemblyQuoteList";
import CheckIcon from "@/assets/icons/check.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeQuoteItems, clearQuoteItems } from "@/store/slices/quoteSlice";

function PcAssemblyQuote() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

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

  return (
    <main className="pc-assembly-quote">
      <h2 className="pc-assembly-quote__title">견적 리스트</h2>

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
            부품 {items.length} 선택
          </div>
          <div className="pc-assembly-quote__compatibility-status">호환성 모두 이상 없음</div>
        </section>

        <strong className="pc-assembly-quote__total">
          TOTAL : ₩{totalPrice.toLocaleString("ko-KR")}
        </strong>

        <div className="pc-assembly-quote__right">
          <section className="pc-assembly-quote__performance">
            <h3 className="pc-assembly-quote__section-title">성능 분석</h3>
            <div className="pc-assembly-quote__panel">
              <div className="pc-assembly-quote__panel-item">
                <span className="indicator indicator--warning"></span>GPU 대비 파워 용량 부족
              </div>
              <div className="pc-assembly-quote__panel-item">
                <span className="indicator indicator--ok"></span>RAM 용량 충분
              </div>
            </div>
          </section>

          <section className="pc-assembly-quote__recommend">
            <h3 className="pc-assembly-quote__section-title">업그레이드 추천</h3>
            <div className="pc-assembly-quote__panel">업그레이드 추천입니다.</div>
          </section>

          <section className="pc-assembly-quote__action">
            <button
              className="pc-assembly-quote__action-button pc-assembly-quote__action-button--secondary"
              type="button"
              onClick={() => {
                dispatch(clearQuoteItems());
                setSelectedIds([]);
              }}
            >
              초기화
            </button>
            <button className="pc-assembly-quote__action-button" type="button">
              장바구니 담기
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PcAssemblyQuote;
