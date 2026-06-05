import os

from fastapi import FastAPI
from fastapi.responses  import FileResponse
from sqlalchemy import create_engine
from sqlalchemy import text
from openpyxl import Workbook

app = FastAPI()

engine = create_engine(
    "mysql+pymysql://root:Mt33070402%40@localhost/todoapp"
)

#テーブル情報の取得
@app.get("/todos/{user_id}")
def get_user_todos(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                 SELECT * from todos
                 WHERE user_id = :user_id
                 ORDER BY task_date
                 """),
                 {"user_id":user_id}
                 )
        
        rows = result.fetchall()

        return [
            dict(row._mapping)
            for row in rows
        ]

#Excelを生成
@app.get("/excel/{user_id}")
def export_excel(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                 SELECT * FROM todos 
                 WHERE user_id = :user_id
                 ORDER BY task_date
                 """),
                 {"user_id": user_id}
        )

        todos = result.fetchall()
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Todo"
    ws.append(
        [
            "ID",
            "タスク",
            "期限",
            "完了"
        ]
    )

    for todo in todos:
        ws.append(
            [
                todo.id,
                todo.task,
                str(todo.task_date),
                "完了" if todo.completed else "未完了"
            ]
        )   

    os.makedirs(
        "__Excel",
        exist_ok=True
    )
    filename = f"__Excel/todo_{user_id}.xlsx"
    wb.save(filename)

    return FileResponse(
        filename,
        filename="todo.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )