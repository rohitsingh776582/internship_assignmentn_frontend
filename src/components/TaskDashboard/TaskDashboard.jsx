import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Trash2, CheckCircle, Circle, LogOut, X, Pencil } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = () => axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const TaskDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | pending | completed
  const [modal, setModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api().get('/tasks');
      setTasks(res.data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '' });
    setModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTask) {
        const res = await api().put(`/tasks/${editTask.id}`, form);
        setTasks(prev => prev.map(t => t.id === editTask.id ? res.data : t));
      } else {
        const res = await api().post('/tasks', form);
        setTasks(prev => [res.data, ...prev]);
      }
      setModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api().delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api().patch(`/tasks/${id}/status`);
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'completed' ? t.status === true :
      t.status === false;
    return matchSearch && matchFilter;
  });

  const completed = tasks.filter(t => t.status === true).length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600">DevManager</div>
        <nav className="flex-1 px-4 space-y-2">
          <span className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">Dashboard</span>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Logged in as</p>
          <p className="text-sm font-semibold truncate">{user.full_name || user.email}</p>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-sm text-gray-500">{completed}/{tasks.length} completed</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Search & Filter & Add */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text" placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={filter} onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-sm"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No tasks found. Create one!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-3">
                  <button onClick={() => handleToggle(task.id)} className="mt-0.5">
                    {task.status
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <Circle className="w-5 h-5 text-gray-300 hover:text-blue-400 transition" />
                    }
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEdit(task)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className={`font-semibold text-base mb-1 ${task.status ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                )}
                <div className="mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {task.status ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text" required placeholder="Task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3} placeholder="Optional description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400">
                  {saving ? 'Saving...' : editTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
