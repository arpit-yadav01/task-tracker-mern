import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskListPage from "./pages/TaskListPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<TaskListPage />} />
    </Routes>
  );
}

export default App;
