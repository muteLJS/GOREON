import PcAssemblyQuoteItem from "@/components/PcAssemblyQuoteItem/PcAssemblyQuoteItem";
import "./PcAssemblyQuoteList.scss";

function PcAssemblyQuoteList({ productList, selectedIds, onSelectItem }) {
  return (
    <div className="pc-assembly-quote-list">
      {productList.map((item) => (
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
      ))}
    </div>
  );
}

export default PcAssemblyQuoteList;
