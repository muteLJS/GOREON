import RatingEmpty from "@/assets/icons/rating-empty.svg";
import RatingFull from "@/assets/icons/rating-full.svg";
import "./Rating.scss";

function Rating({ rating = 5 }) {
  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => (
        <img key={index} src={index < rating ? RatingFull : RatingEmpty} alt="rating" />
      ))}
    </div>
  );
}

export default Rating;
