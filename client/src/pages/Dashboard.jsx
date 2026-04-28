import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks?status=${filter}&search=${search}&sort=${sort}`);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/tasks/stats');
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filter, search, sort]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await API.put(`/tasks/${editTask._id}`, form);
        toast.success('Task updated!');
      } else {
        await API.post('/tasks', form);
        toast.success('Task created!');
      }
      setShowModal(false);
      setEditTask(null);
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '' });
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted!');
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/tasks/${id}/toggle`);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const priorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-700';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span>Hello, {user?.name}!</span>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500' },
            { label: 'Completed', value: stats.completed, color: 'bg-green-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'Overdue', value: stats.overdue, color: 'bg-red-500' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} text-white rounded-lg p-4 text-center`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          <button onClick={() => { setShowModal(true); setEditTask(null); setForm({ title: '', description: '', priority: 'Medium', dueDate: '' }); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Add Task
          </button>
        </div>

        {/* Tasks */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No tasks found. Add one!</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className={`bg-white rounded-lg p-4 shadow-sm flex items-start gap-4 ${task.isCompleted ? 'opacity-60' : ''}`}>
                <input type="checkbox" checked={task.isCompleted} onChange={() => handleToggle(task._id)}
                  className="mt-1 w-5 h-5 cursor-pointer" />
                <div className="flex-1">
                  <h3 className={`font-semibold text-gray-800 ${task.isCompleted ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-gray-500 text-sm mt-1">{task.description}</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(task)}
                    className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;