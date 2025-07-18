import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteCourse, bulkDeleteCourses } from "../redux/coursesSlice";
import { useState } from "react";

const PAGE_SIZE = 10;

function Home() {
  const courses = useSelector((state) => state.courses.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UI State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("az");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  // Filtering, searching, sorting
  let filtered = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  if (category) filtered = filtered.filter(c => c.category === category);
  if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty);
  if (sort === "az") filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk select
  const toggleSelect = (id) => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]
    );
  };
  const selectAll = () => {
    setSelected(paged.map(c => c.id));
  };
  const clearAll = () => setSelected([]);

  // Bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (window.confirm("Delete selected courses?")) {
      dispatch(bulkDeleteCourses(selected));
      setSelected([]);
    }
  };

  // Single delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Your Courses</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option>Programming</option>
          <option>Design</option>
          <option>Business</option>
          <option>Marketing</option>
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border p-2 rounded">
          <option value="">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded">
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => navigate("/create")}
        >
          + Create Course
        </button>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-2">
        <button
          className="bg-gray-200 px-2 py-1 rounded"
          onClick={selectAll}
        >Select All</button>
        <button
          className="bg-gray-200 px-2 py-1 rounded"
          onClick={clearAll}
        >Clear All</button>
        <button
          className="bg-red-600 text-white px-2 py-1 rounded"
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
        >Delete Selected</button>
        <span className="ml-2 text-sm text-gray-500">{selected.length} selected</span>
      </div>

      {/* Course grid */}
      {paged.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paged.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col justify-between border ${selected.includes(course.id) ? "border-blue-500" : ""}`}
            >
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selected.includes(course.id)}
                  onChange={() => toggleSelect(course.id)}
                  className="mr-2"
                />
                <img
                  src={course.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
                  onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"; }}
                  alt={course.title}
                  className="w-20 h-14 object-cover rounded"
                />
              </div>
              <Link to={`/course/${course.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline mb-1">
                  {course.title}
                </h2>
              </Link>
              <span className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-2">{course.category}</span>
              <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded">{course.difficulty}</span>
              <div className="flex justify-between items-center text-sm mt-auto">
                <Link to={`/edit/${course.id}`} className="text-yellow-600 hover:underline">
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;