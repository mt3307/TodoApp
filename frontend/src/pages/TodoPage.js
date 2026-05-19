import {useEffect, useState} from "react";
import axios from "../api/axios";

function TodoPage() {
    //ログイン時に保存したユーザの取り出し
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [taskDate, setTaskDate] = useState("");

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

    //新規タスク登録
    const addTodo = async () => {
        if(task.trim() === "") {
            window.confirm("タスクを入力してください");
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

    //ログアウト処理
    const logout = () => {
        const ok = window.confirm("ログアウトしますか？")

        if(!ok) return;
        //保存済みログイン情報の削除
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    return (
        <div style={{
            backgroundColor: "#fff9cc",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <title>ToDoアプリ</title>
            <h1>ToDo一覧</h1>
            <p style={{ fontSize: "14px" }}>タスクと日付を入力してください</p>
            <input
                value={task}
                onChange={(e)=> setTask(e.target.value)}
                placeholder="タスク"
             />
             <input
                type="date"
                value={taskDate}
                onChange={(e)=> setTaskDate(e.target.value)}
                placeholder="タスク"
             />
             <button onClick={addTodo}>登録</button>
             <hr />
             {  
                //タスク一覧をループ取得、表示
                todos.map(todo => (
                    <div key={todo.id}
                         style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px"
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
                        <button onClick={()=> updateTodo(todo)}>編集</button>
                        <button onClick={()=> {deleteTodo(todo.id)}}>削除</button>
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
            <button onClick={logout}>ログアウト</button>
        </div>
    );
}

export default TodoPage;