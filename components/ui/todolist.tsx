import React, { useState, useRef } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface DayTodos {
  day: string;
  todos: Todo[];
}

const daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ToDoList: React.FC = () => {
  const [weekTodos, setWeekTodos] = useState<DayTodos[]>(() =>
    daysOfWeek.map(day => ({ day, todos: [] }))
  );

  const todoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const addTodo = (dayIndex: number, todoIndex: number): void => {
    const newTodo: Todo = { id: Date.now(), text: '', completed: false };
    const updatedWeekTodos = weekTodos.map((dayItem, index) => {
        if (index === dayIndex) {
            const newTodos = [...dayItem.todos];
            newTodos.splice(todoIndex + 1, 0, newTodo); // Inserts new todo after the current todo
            return { ...dayItem, todos: newTodos };
        }
        return dayItem;
    });
    setWeekTodos(updatedWeekTodos);
    setTimeout(() => {
        todoRefs.current[newTodo.id]?.focus(); // Focus on the new todo
    }, 0);
  };

  const updateTodo = (dayIndex: number, todoId: number, newText: string): void => {
    const updatedWeekTodos = weekTodos.map((item, index) => {
      if (index === dayIndex) {
        const updatedTodos = item.todos.map(todo =>
          todo.id === todoId ? { ...todo, text: newText } : todo
        );
        return { ...item, todos: updatedTodos };
      }
      return item;
    });
    setWeekTodos(updatedWeekTodos);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, dayIndex: number, todoId: number): void => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const currentTodoIndex = weekTodos[dayIndex].todos.findIndex(todo => todo.id === todoId);
        addTodo(dayIndex, currentTodoIndex); // Pass the current todo index
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && e.currentTarget.textContent === '') {
        e.preventDefault(); 
        const updatedWeekTodos = weekTodos.map((item, index) => {
            if (index === dayIndex) {
                const pos = item.todos.findIndex(todo => todo.id === todoId);
                const filteredTodos = item.todos.filter(todo => todo.id !== todoId);
                setTimeout(() => {
                    if (pos > 0 && todoRefs.current[item.todos[pos - 1].id]) {
                        const previousTodoElement = todoRefs.current[item.todos[pos - 1].id];
                        if (previousTodoElement) {
                            previousTodoElement.focus();
                            const range = document.createRange();
                            const sel = window.getSelection();
                            if (sel) {
                                range.selectNodeContents(previousTodoElement);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                }, 0);
                return { ...item, todos: filteredTodos };
            }
            return item;
        });
        setWeekTodos(updatedWeekTodos);
    }
  };

  const toggleTodo = (dayIndex: number, todoId: number): void => {
    const updatedWeekTodos = weekTodos.map((dayItem, index) => {
      if (index === dayIndex) {
        const updatedTodos = dayItem.todos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
        return { ...dayItem, todos: updatedTodos };
      }
      return dayItem;
    });
    setWeekTodos(updatedWeekTodos);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {weekTodos.map((dayItem, dayIndex) => (
        <div key={dayItem.day} className="p-4 m-6 border rounded-lg shadow-lg bg-opacity-90 bg-gradient-to-br from-blue-900 to-gray-800 backdrop-blur-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 min-w-[300px] max-w-[500px]" style={{ zIndex: 1000, minHeight: '150px' }}>
          <h3 className="font-bold text-lg text-blue-200 mb-2">{dayItem.day}</h3>
          <div>
            {dayItem.todos.map((todo, todoIndex) => (
              <div key={todo.id} className="flex items-center my-3"> {/* Changed from items-start to items-center */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(dayIndex, todo.id)}
                  className="mr-2 h-5 w-5 accent-blue-400 mt-1"
                />
                <div
                  ref={el => { todoRefs.current[todo.id] = el; }}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateTodo(dayIndex, todo.id, e.currentTarget.textContent || '')}
                  onKeyDown={(e) => handleKeyDown(e, dayIndex, todo.id)}
                  className="editable-div"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => addTodo(dayIndex, dayItem.todos.length - 1)}
            className="mt-3 bg-blue-800 hover:bg-blue-700 text-blue-200 font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            style={{ zIndex: 1000 }}
          >
            Add New Todo
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToDoList