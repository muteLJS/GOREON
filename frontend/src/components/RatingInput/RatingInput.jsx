import RatingEmpty from "@/assets/icons/rating-empty.svg";
import RatingFull from "@/assets/icons/rating-full.svg";
import "./RatingInput.scss";

function RatingInput({ value = 0, onChange }) {
  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          className="rating-input__button"
          onClick={() => onChange(score)}
        >
          <img src={score <= value ? RatingFull : RatingEmpty} alt="" />
        </button>
      ))}
    </div>
  );
}

export default RatingInput;
