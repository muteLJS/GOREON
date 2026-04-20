import "./AICharacter.scss";
import CharacterImage from "assets/logo/ai/character.svg";

function AICharacter({ className = "", title = "AI 고르미 캐릭터", animated = true }) {
  return (
    <span className={`ai-character ${animated ? "is-animated" : ""} ${className}`.trim()}>
      <img className="ai-character__image" src={CharacterImage} alt={title} />
    </span>
  );
}

export default AICharacter;
