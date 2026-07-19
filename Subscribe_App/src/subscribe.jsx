import { useState } from "react";

function Subscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  function handleClick() {
    setIsSubscribed(!isSubscribed);
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "120px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>YouTube Channel</h1>
      <p
        style={{
          padding: "20px",
        }}
      >
        Click the button to subscribe.
      </p>

      <button
        onClick={handleClick}
        style={{
          backgroundColor: isSubscribed ? "#16a34a" : "#ff0000",
          color: "white",
          border: "none",
          padding: "12px 30px",
          borderRadius: "25px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </button>

      <h3
        style={{
          marginTop: "20px",
          color: isSubscribed ? "green" : "red",
        }}
      >
        {isSubscribed
          ? "Thanks for subscribing!"
          : "Please subscribe to our channel."}
      </h3>
    </div>
  );
}

export default Subscribe;
