import { useState } from "react";
import axios from "../api/axios";

function Register() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {

        if(userId.trim() === "") {
            window.alert("ユーザIDを入力してください");
            return;
        }

        if(password.trim() === "") {
            window.alert("パスワードを入力してください")
            return;
        }

        try {
            await axios.post(
                "/auth/register",
                {
                    userId,
                    password
                }
            );
            
            setUserId("");
            setPassword("");
            alert("登録に成功しました");
            window.location.href = "/";

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("サーバ接続エラー");
            }
        }
    };

    return (
        <div style={{
            backgroundColor: "#d0e2be",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <title>ToDoアプリ</title>
            <h1>ユーザ登録</h1>
            <p style={{ fontSize: "14px" }}>ユーザIDとパスワードを入力してください</p>
            <input
                value={userId}
                placeholder = "ユーザID"
                onChange = {(e) => setUserId(e.target.value)}
            />
            <input
                type="password"
                value={password}
                placeholder = "パスワード"
                onChange = {(e) => setPassword(e.target.value)}
            />
            <button 
                onClick={register}
                style={{
                    backgroundColor:"#C0C0C0",
                    coloer:"white",
                    border:"none",
                    padding:"8px 16px",
                    borderRadius:"5px",
                    cursor:"pointer"
                }}>登録
            </button>
            <hr />
            <a href="/">戻る</a>
        </div>
    );
}

export default Register;