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
            alert("登録に成功しました");
            window.location.href = "/";
        } catch (error) {
            alert(error.response.data);
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
            <p font size="3">ユーザIDとパスワードを入力してください</p>
            <input
                placeholder = "ユーザID"
                onChange = {(e) => setUserId(e.target.value)}
             />
             <input
                type="password"
                placeholder = "パスワード"
                onChange = {(e) => setPassword(e.target.value)}
             />
             <button onClick={register}>登録</button>
             <hr />
             <a href="/">戻る</a>
        </div>
    );
}

export default Register;