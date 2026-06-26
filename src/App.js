import { useState } from 'react';
import './App.css';

const INITIAL_TASKS = [
  { id: 1, title: 'Design portfolio layout', description: 'Create wireframes for portfolio site', priority: 'High', status: 'Done', deadline: '2026-06-20' },
  { id: 2, title: 'Build Gaming Dashboard', description: 'Connect RAWG API and build UI', priority: 'High', status: 'Done', deadline: '2026-06-25' },
  { id: 3, title: 'Build Pet Warning Designer', description: 'Image upload and canvas export', priority: 'Medium', status: 'Done', deadline: '2026-06-26' },
  { id: 4, title: 'Build TaskForge', description: 'Dashboard, Kanban, and task management', priority: 'High', status: 'In Progress', deadline: '2026-07-05' },
  { id: 5, title: 'Deploy all projects', description: 'Deploy to Vercel and update portfolio', priority: 'Medium', status: 'In Progress', deadline: '2026-07-10' },
  { id: 6, title: 'Start applying for jobs', description: 'Send out applications to junior positions', priority: 'High', status: 'To Do', deadline: '2026-08-01' },
];

const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskforge-tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [view, setView] = useState('dashboard');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'To Do', deadline: '' });

  const saveTasks = (updated) => {
    setTasks(updated);
    localStorage.setItem('taskforge-tasks', JSON.stringify(updated));
  };

  const addTask = () => {
    if (!newTask.title) return;
    const task = { ...newTask, id: Date.now() };
    saveTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'Medium', status: 'To Do', deadline: '' });
    setShowForm(false);
  };

  const deleteTask = (id) => saveTasks(tasks.filter(t => t.id !== id));

  const filteredTasks = filterPriority === 'All' ? tasks : tasks.filter(t => t.priority === filterPriority);

  const getCount = (status) => tasks.filter(t => t.status === status).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>⚡ TaskForge</h2>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>📊 Dashboard</button>
          <button className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>✅ Tasks</button>
          <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}>🗂 Kanban</button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>{view === 'dashboard' ? 'Dashboard' : view === 'tasks' ? 'All Tasks' : 'Kanban Board'}</h1>
          <button className="add-btn" onClick={() => setShowForm(true)}>+ New Task</button>
        </header>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>New Task</h3>
              <input placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              <textarea placeholder="Description" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
              <div className="modal-btns">
                <button onClick={() => setShowForm(false)}>Cancel</button>
                <button className="save-btn" onClick={addTask}>Save Task</button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-row">
              <div className="stat-card"><span className="stat-num">{tasks.length}</span><span>Total Tasks</span></div>
              <div className="stat-card"><span className="stat-num">{getCount('To Do')}</span><span>To Do</span></div>
              <div className="stat-card"><span className="stat-num">{getCount('In Progress')}</span><span>In Progress</span></div>
              <div className="stat-card done"><span className="stat-num">{getCount('Done')}</span><span>Done</span></div>
            </div>
            <h3>Recent Tasks</h3>
            <div className="task-list">
              {tasks.slice(-4).reverse().map(task => (
                <div className="task-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                  </div>
                  <div className="task-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span className={`status ${task.status.replace(' ', '-').toLowerCase()}`}>{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'tasks' && (
          <div className="tasks-view">
            <div className="filter-bar">
              {PRIORITIES.map(p => (
                <button key={p} className={filterPriority === p ? 'active' : ''} onClick={() => setFilterPriority(p)}>{p}</button>
              ))}
            </div>
            <div className="task-list">
              {filteredTasks.map(task => (
                <div className="task-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    {task.deadline && <p className="deadline">📅 {task.deadline}</p>}
                  </div>
                  <div className="task-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span className={`status ${task.status.replace(' ', '-').toLowerCase()}`}>{task.status}</span>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'kanban' && (
          <div className="kanban">
            {STATUSES.map(status => (
              <div className="kanban-col" key={status}>
                <h3>{status} <span className="col-count">{getCount(status)}</span></h3>
                {tasks.filter(t => t.status === status).map(task => (
                  <div className="kanban-card" key={task.id}>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <div className="card-footer">
                      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.deadline && <span className="deadline">📅 {task.deadline}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;