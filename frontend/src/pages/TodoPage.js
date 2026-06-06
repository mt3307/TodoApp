import {useEffect, useState} from "react";
import axios from "../api/axios";

function TodoPage() {
    
    //ログイン時に保存したユーザの取り出し
    const user = JSON.parse(
        localStorage.getItem("user")
    );
    //アクセス制御
    if (!user) {
        window.location.href = "/";
    }

    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const incompletedCount = totalCount - completedCount;

    //DBからToDo一覧を取得
    const loadTodos = async() => {
        const res = await axios.get(`/todos/${user.id}`);
        //取得した一覧をStateに保存
        setTodos(res.data);
    };

    //画面初回表示時のみ実行
    useEffect(() => {
        loadTodos();
        // eslint-disable-next-line
    }, []);

    //タスクの期限切れを判定
    const isExpired = (taskDate) => {
        const today = new Date().toISOString().split("T")[0]; //取得した日付を文字列（YYYY-MM-DD）にして比較（例："2026-06-06"）
        return taskDate < today;
    }

    //新規タスク登録
    const addTodo = async () => {
        if(task.trim() === "") {
            window.confirm("タスクを入力してください");
            return;
        }

        if(task.length > 50) {
            window.alert("タスクは50文字以内で入力してください");
            return;
        } 

        if(taskDate === "") {
            window.alert("日付を入力してください")
            return;
        }

        await axios.post(`/todos/${user.id}`,
            {
                task,
                taskDate
            }
        );

        window.alert("タスクを登録しました")
        //登録後、入力フォームをクリア
        setTask("");
        setTaskDate("");
        //一覧更新
        loadTodos();
    };

    //タスク更新処理
    const updateTodo = async (todo) => {
        const newTask = window.prompt(
            "新しいタスクを入力してください",
            todo.task
        );

        if(newTask === null) return;
        if(newTask.trim() === "") {
            window.alert("タスクを入力してください");
            return;
        }

        if(newTask.length > 50) {
            window.alert("タスクは50文字以内で入力してください");
            return;
        }

        const ok = window.confirm("タスクを更新しますか？");
        if(!ok) return;

        await axios.put(
            `/todos/${todo.id}`,
            {
                task: newTask,
                taskDate: todo.taskDate
            }
        );
        
        window.alert("タスクを更新しました");
        loadTodos();
    }

    //タスク削除処理
    const deleteTodo = async (id) => {
        const ok = window.confirm("本当に削除しますか？");
        if(!ok) return;
        
        await axios.delete(`/todos/${id}`);

        window.alert("タスクを削除しました")
        loadTodos();
    };

    //チェックボックスのチェック切り替え
    const toggleComplete = async (todo) => {
        await axios.put(
            `/todos/${todo.id}`,
            {
                task: todo.task,
                taskDate: todo.taskDate,
                completed: !todo.completed
            }
        );

        loadTodos();
    }

    //Excelをダウンロードする機能
    const exportExcel = () => {
        window.open(
            `http://localhost:8080/excel/${user.id}`,"_blank"
        );
    };

    //ページ最上部へ戻る関数
    const scrollToTop = () => {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    };

    //ログアウト処理
    const logout = () => {
        const ok = window.confirm("ログアウトしますか？")

        if(!ok) return;
        //保存済みログイン情報の削除
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    //パスワード変更の関数
    const changePassword = async() => {
        try {
            await axios.post("/auth/change-password", 
                {
                    userId: user.id,
                    currentPassword,
                    newPassword
                }
            );

            alert("パスワード変更成功");
            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {
            if (error.response) {
                alert(error.response.data);
            }
        }
    };

    /*デバッグ用
    console.log({
        task,
        taskDate,
        todos,
        user
    });*/

    return (
        <div style={{
            backgroundColor: "#fff9cc",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <title>ToDoアプリ</title>
            <h1>ToDo一覧</h1>
            <div style={{marginBottom:"20px", fontWeight:"bold"}}>    
                <p>総件数：{totalCount}件</p>
                <p>完了：{completedCount}件</p>
                <p>未完了件：{incompletedCount}</p>
            </div>
            <p style={{ fontSize: "14px" }}>タスクと日付を入力してください （{task.length}/50文字）</p>
            <input
                value={task}
                onChange={(e)=> setTask(e.target.value)}
                maxLength={50}
                placeholder="タスク"
            />
            <input
                type="date"
                value={taskDate}
                onChange={(e)=> setTaskDate(e.target.value)}
                placeholder="タスク"
            />
            <button 
                onClick={addTodo}
                style={{
                    backgroundColor:"#4CAF50",
                    coloer:"white",
                    border:"none",
                    padding:"5px 12px",
                    borderRadius:"5px",
                    cursor:"pointer"
                }}>登録
            </button>
            <hr />
            {  
                //タスク一覧をループ取得、表示
                todos.map(todo => (
                    <div key={todo.id}
                         style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                            color:
                                isExpired(todo.taskDate) && !todo.completed ? "red" : "black",
                            fontWeight: 
                                isExpired(todo.taskDate) && !todo.completed ? "bold" : "normal"
                         }}
                    >
                    <input type="checkbox"
                           checked={todo.completed}
                           onChange={() => toggleComplete(todo)}
                    />
                    <div style={{width: "150px",
                                textDecoration: todo.completed ?"line-through" :"none"
                                }}>
                        {todo.task}
                    </div>
                    <div style={{width: "120px"}}>
                        {todo.taskDate}
                    </div>
                        <button 
                            onClick={()=> updateTodo(todo)}
                            style={{
                                backgroundColor:"#2196F3",
                                color:"white",
                                border:"none",
                                padding:"5px 12px",
                                borderRadius:"5px",
                                curor:"pointer"
                            }}>編集
                        </button>
                        <button 
                            onClick={()=> {deleteTodo(todo.id)}}
                            style={{
                                backgroundColor:"#f44336",
                                color:"white",
                                border:"none",
                                padding:"5px 12px",
                                borderRadius:"5px",
                                cursor:"pointer"
                            }}>削除
                        </button>
                    </div>
                ))
            }
            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center"
                }}
            />
            <hr />
            <h3>パスワード変更</h3>
            <input 
                type="password"
                placeholder="現在のパスワード"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
                onClick={changePassword}
                style={{
                    backgroundColor:"#f44336",
                    color:"white",
                    border:"none",
                    padding:"5px 12px",
                    borderRadius:"5px",
                    cursor:"pointer"
                }}>パスワード変更   
            </button>
            <hr />
            <div style={{display:"flex", gap:"10px"}}>
                <button 
                    onClick={exportExcel}
                    style={{
                        backgroundColor:"#1D6F42",
                        color:"white",
                        border:"none",
                        padding:"8px 16px",
                        borderRadius:"5px",
                        cursor:"pointer"
                    }}>Excel出力
                </button>
                <button 
                    onClick={logout}
                    style={{
                        backgroundColor:"#666",
                        color:"white",
                        border:"none",
                        padding:"8px 16px",
                        borderRadius:"5px",
                        cursor:"pointer"
                    }}>ログアウト
                </button>
            </div>
            <button
                onClick={scrollToTop}
                style={{
                    position:"fixed",
                    bottom:"20px",
                    right:"20px",
                    backgroundColor:"#2196F3",
                    color:"white",
                    border:"none",
                    borderRadius:"50%",
                    width:"50px",
                    height:"50px",
                    cursor:"pointer",
                    fontsize:"20px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                }}
            >↑TOP</button>
        </div>
    );
}

export default TodoPage;