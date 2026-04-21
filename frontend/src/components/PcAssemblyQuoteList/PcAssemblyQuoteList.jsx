import PcAssemblyQuoteItem from "@/components/PcAssemblyQuoteItem/PcAssemblyQuoteItem";
import "./PcAssemblyQuoteList.scss";

function PcAssemblyQuoteList({ productList, selectedIds, onSelectItem }) {
  return (
    <div
      className={`pc-assembly-quote-list ${
        productList.length > 0 ? "pc-assembly-quote-list--has-items" : "pc-assembly-quote-list--empty"
      }`}
    >
      {productList.length > 0 ? (
        productList.map((item) => (
          <PcAssemblyQuoteItem
            isSelected={selectedIds.includes(item.id)}
            onSelect={() => onSelectItem(item.id)}
            key={item.id}
            productId={item.productId}
            category={item.category}
            name={item.name}
            option={item.option}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
            compatibility={item.compatibility}
          />
        ))
      ) : (
        <p className="pc-assembly-quote-list__empty">아직 담긴 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default PcAssemblyQuoteList;
