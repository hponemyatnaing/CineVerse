import "./ActivityTimeline.css";

function ActivityTimeline({ activities = [] }) {
  return (
    <div className="timeline">
      {activities.length === 0 ? (
        <p className="empty-text">No activity yet</p>
      ) : (
        activities.map((item, index) => (
          <div className="timeline-item" key={index}>
            <div className="dot"></div>

            <div>
              <h4>{item.title}</h4>

              <p>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : item.date || "Just now"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ActivityTimeline;
