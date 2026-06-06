import { useState } from "react";
import axios from "../api/axios";

function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await axios.post(
                "/auth/login",
                {
                    userId,
                    password
                }
            );
            
            localStorage.setItem(
                "user",
                JSON.stringify(res.data)
            );

            window.location.href = "/todo";

        } catch {
            alert("ユーザIDまたはパスワードが違います");
        }
    };

    return (
        <div style={{
            backgroundColor: "#e6f7ff",
            minHeight: "100vh",
            padding: "20px"}}>
            <title>ToDoアプリ</title>
            <h1>ログイン</h1>
            <p style={{ fontSize: "14px" }}>ユーザIDとパスワードを入力してください</p>
            <input
                value={userId}
                placeholder="UserID"
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                value={password}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button 
                onClick={login}
                style={{
                    backgroundColor:"#C0C0C0",
                    coloer:"white",
                    border:"none",
                    padding:"8px 16px",
                    borderRadius:"5px",
                    cursor:"pointer"
                }}>ログイン
            </button>
            <br />
            <hr />
            <div style={{justifyContent:"space-between",alignItems:"center"}}>
            <a href="/register">初回登録はこちら</a>
            </div>
        </div>
    );
}

export default Login;