import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import News from './pages/News.jsx'
import Events from './pages/Events.jsx'
import Clubs from './pages/Clubs.jsx'
import StudentLife from './pages/StudentLife.jsx'
import PostDetail from './pages/PostDetail.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news' element={<News/>} />
        <Route path='/news/:id' element={<PostDetail />} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/:id' element={<PostDetail />} />
        <Route path='/clubs' element={<Clubs />} />
        <Route path='/clubs/:id' element={<PostDetail />} />
        <Route path='/student-life' element={<StudentLife />} />
        <Route path='/student-life/:id' element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
