import "./style.css";
import "./images/favicon.png";
import "emoji-picker-element";
import getName from "./getName";
import getRandomColor from "./getColor";
import toggle from "./toggle";
import createMemberElement from "./memberElement";

const CHANNEL_ID = "wU0rP95TrerGgN3z";
let members = [];
let me;

const DOM = {
  me: document.querySelector(".me"),
  membersCount: document.querySelector(".members-count"),
  membersList: document.querySelector(".members-list"),
  messages: document.querySelector(".messages"),
  input: document.querySelector(".form-input"),
  form: document.querySelector(".message-form"),
  emojiButton: document.querySelector(".emoji-button"),
  tooltip: document.querySelector(".tooltip"),
};

DOM.form.addEventListener("submit", sendMessage);
DOM.emojiButton.addEventListener("click", toggle);
document
  .querySelector("emoji-picker")
  .addEventListener("emoji-click", (event) => {
    DOM.input.value += event.detail.emoji.unicode;
    DOM.input.focus;
  });

const drone = new ScaleDrone(CHANNEL_ID, {
  data: {
    name: getName(),
    color: getRandomColor(),
  },
});

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("members", (m) => {
    members = m;
    me = members.find((m) => m.id === drone.clientId);
    updateMembers();
  });

  room.on("member_join", (member) => {
    members.push(member);
    updateMembers();
  });

  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembers();
  });

  room.on("data", (text, member) => {
    if (member) {
      addMessageToList(text, member);
    } else {
      console.log(text);
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function sendMessage() {
  const value = DOM.input.value;
  if (value === "") {
    return;
  }
  DOM.input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

function updateMembers() {
  const DOM = {
    me: document.querySelector(".me"),
    membersCount: document.querySelector(".members-count"),
    membersList: document.querySelector(".members-list"),
  };

  DOM.me.innerHTML = "";
  DOM.me.appendChild(createMemberElement(me));
  DOM.membersList.innerHTML = "";
  members.forEach((member) =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
  if (members.length > 1) {
    return (DOM.membersCount.innerText = `${members.length} users in room:`);
  } else {
    return (DOM.membersCount.innerText = `${members.length} user in room:`);
  }
}

function createMessageElement(text, member) {
  const el = document.createElement("div");
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = "message";
  return el;
}

function addMessageToList(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
