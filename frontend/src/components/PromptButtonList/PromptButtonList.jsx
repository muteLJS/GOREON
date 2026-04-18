function PromptButtonList({ items }) {
  return (
    <div className="buttons">
      {items.map((item) => (
        <button key={item} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}

export default PromptButtonList;
