import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ScreenAlertOverlay.scss';

// Keep these in sync with the animation/transition durations in MessageBanner.css
const OPEN_MS = 600; // upper layer expands from center
const HOLD_MS = 3000; // upper layer stays fully visible
const CLOSE_MS = 600; // upper layer clips away from center
const MESSAGE_MS = 4000; // lower layer stays visible
const CLEAR_MS = 400; // lower layer fades out

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------
// MESSAGE TYPES: to add a new type, add one entry here. Nothing else changes.
//   upper: label and colors for the upper layer
//   Lower: component for the lower layer; receives the whole message as `data`
// ---------------------------------------------------------------
const MESSAGE_TYPES = {
  follow: {
    upper: { label: "NEW FOLLOW", background: "#facc15", color: "#000" },
    Lower: ({ data }) => <span>Welcome {data.username}!</span>,
  },
  checkin: {
    upper: { label: "CHECK IN", background: "#f97316", color: "#fff" },
    Lower: ({ data }) => (
      <div className="checkin">
        <img className="checkin_img" src={`/browsersrc-mainframe/img/nameplates/${data.nameplate}.png`} alt="" />
        <div>
          <div className="checkin_name">{data.username}</div>
          <div className="checkin_info">
            Level {data.level}: {data.title}
          </div>
        </div>
      </div>
    ),
  },
};

const ScreenAlertOverlay = () => {
  // idle | opening | holding | closing | showing | clearing
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState(null);

  const queue = useRef([]);
  const busy = useRef(false);
  const alive = useRef(true);
 
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Plays queued messages one at a time. It never looks inside a message.
  const run = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
 
    while (queue.current.length && alive.current) {
      setMessage(queue.current.shift());
 
      setPhase("opening");
      await sleep(OPEN_MS);
      setPhase("holding");
      await sleep(HOLD_MS);
      setPhase("closing");
      await sleep(CLOSE_MS);
      setPhase("showing");
      await sleep(MESSAGE_MS);
      setPhase("clearing");
      await sleep(CLEAR_MS);
      setPhase("idle");
    }
 
    busy.current = false;
  }, []);

  // Call this from your real WebSocket handler. If the socket sends JSON text,
  // parse it first (in a try/catch):
  //   socket.onmessage = (e) => enqueueMessage(JSON.parse(e.data));
  const enqueueMessage = useCallback(
    (msg) => {
      if (!msg || !MESSAGE_TYPES[msg.type]) {
        console.warn("Unknown message type:", msg);
        return; // ignored, so the queue is never blocked by bad data
      }
      queue.current.push(msg);
      run();
    },
    [run]
  );

  const config = message ? MESSAGE_TYPES[message.type] : null;
  const Lower = config ? config.Lower : null;
 
  // --- Temporary: simulates the WebSocket calls ---
  const counter = useRef(0);
  const simulateFollow = () => {
    counter.current += 1;
    enqueueMessage({
      type: "follow",
      username: `username${counter.current}` 
    });
  };
  const simulateCheckin = () => {
    counter.current += 1;
    enqueueMessage({
      type: "checkin",
      username: `username${counter.current}`,
      level: 5,
      title: "Power User",
      nameplate: "premium",
    });
  };

  return (
    <>
    <div id="screen-alert-overlay" className={`is-${phase}`}>
      <div className="layer lower">
        {Lower && message && <Lower data={message} />}
      </div>
      <div className="layer upper">
        {config && (
          <div className="notification" style={{ background: config.upper.background, color: config.upper.color }}>
            <span>{config.upper.label}</span>
          </div>
        )}
      </div>      
    </div>
    <button type="button" onClick={simulateFollow}>
      Simulate follow
    </button>{" "}
    <button type="button" onClick={simulateCheckin}>
      Simulate check-in
    </button>
    </>
  )
}

export default ScreenAlertOverlay