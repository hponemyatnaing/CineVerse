import "./AchievementCard.css";

function AchievementCard({ icon, title, description }) {
  return (
    <div className="achievement-card">
      <div className="achievement-icon">{icon}</div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default AchievementCard;
