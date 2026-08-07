import "./ActivityTimeline.css";

import { FaFilm, FaStar, FaHeart } from "react-icons/fa";

function ActivityTimeline({ activities = [] }) {
  return (
    <div className="activity-timeline">
      {/* <h2>Recent Activity</h2> */}

      <div className="activity-list">
        {activities.length === 0 ? (
          <p className="empty-activity">No activity yet</p>
        ) : (
          activities.slice(0, 10).map((item, index) => (
            <div className="activity-item" key={index}>
              <div className="activity-icon">
                {item.type === "favorite" ? (
                  <FaHeart />
                ) : item.type === "review" ? (
                  <FaStar />
                ) : (
                  <FaFilm />
                )}
              </div>

              <div className="activity-content">
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
    </div>
  );
}

export default ActivityTimeline;
