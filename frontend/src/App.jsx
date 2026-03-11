import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Login";
import Profession from "./pages/Profession";
import Chat from "./pages/Chat";
import Upgrade from "./pages/Upgrade";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [sessionId, setSessionId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const handleAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setScreen("profession");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setScreen("landing");
  };

  const goToChat = (sid, utype) => {
    setSessionId(sid);
    setUserType(utype);
    setScreen("chat");
  };

  const reset = () => {
    setSessionId(null);
    setUserType(null);
    setScreen("profession");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {screen === "landing" && (
        <Landing
          isLoggedIn={!!token}
          user={user}
          onGetStarted={() => token ? setScreen("profession") : setScreen("signup")}
          onLogout={handleLogout}
        />
      )}
      {screen === "login" && (
        <Login onAuth={handleAuth} onSwitch={() => setScreen("signup")} onBack={() => setScreen("landing")} />
      )}
      {screen === "signup" && (
        <Signup onAuth={handleAuth} onSwitch={() => setScreen("login")} onBack={() => setScreen("landing")} />
      )}
      {screen === "profession" && (
        <Profession
          token={token}
          user={user}
          onConfirm={goToChat}
          onLogout={handleLogout}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "chat" && (
        <Chat
          sessionId={sessionId}
          userType={userType}
          token={token}
          onReset={reset}
          onUpgrade={() => setScreen("upgrade")}
        />
      )}
      {screen === "upgrade" && (
        <Upgrade onBack={() => setScreen("chat")} />
      )}
    </div>
  );
}