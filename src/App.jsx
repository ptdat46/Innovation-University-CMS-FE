import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import Events from './pages/Events.jsx'
import Clubs from './pages/Clubs.jsx'
import StudentLife from './pages/StudentLife.jsx'
import PostDetail from './pages/PostDetail.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import WriterLogin from './pages/WriterLogin.jsx'
import WriterDashboard from './pages/Writer/WriterDashboard.jsx'
import CreatePost from './pages/Writer/CreatePost.jsx'
import UserLogin from './pages/UserLogin.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news' element={<News/>} />
        <Route path='/news/post/:id' element={<PostDetail />} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/post/:id' element={<PostDetail />} />
        <Route path='/clubs' element={<Clubs />} />
        <Route path='/clubs/post/:id' element={<PostDetail />} />
        <Route path='/student-life' element={<StudentLife />} />
        <Route path='/student-life/post/:id' element={<PostDetail />} />

        {/* Login Routes */}
        <Route path='/login' element={<UserLogin />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/writer/login' element={<WriterLogin />} />

        {/* Admin Routes */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />

        {/* Writer Routes */}
        <Route path='/writer/dashboard' element={<WriterDashboard />} />
        <Route path='/writer/posts/create' element={<CreatePost />} />
        <Route path='/writer/posts/:id' element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
