import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EduNotes from './pages/EduNotes'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/LectureNotes' element={<EduNotes />} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App
