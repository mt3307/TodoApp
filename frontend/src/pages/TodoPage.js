import {useEffect, useState} from "react";
import axios from "../api/axios";

function TodoPage() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [taskDate, setTaskDate] = useState("");

    const loadTodos = async() => {
        const res = await axios.get(`/todos/${user.id}`);
        setTodos(res.data);
    };

    useEffect(() => {
        loadTodos();
        // eslint-disable-next-line
    }, []);

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
        setTask("");
        setTaskDate("");
        loadTodos();
    };

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

    const deleteTodo = async (id) => {
        const ok = window.confirm("本当に削除しますか？");
        if(!ok) return;
        
        await axios.delete(`/todos/${id}`);
        loadTodos();
    };

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

    const logout = () => {
        const ok = window.confirm("ログアウトしますか？")

        if(!ok) return;
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
            <p font size="3">タスクと日付を入力してください</p>
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