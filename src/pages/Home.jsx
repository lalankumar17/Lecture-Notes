import { useNoteStore } from '../store/useNotes'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const { url, videoId, setUrl } = useNoteStore()
  const navigate = useNavigate()
  
  const handleClick = (e) => {
    e.preventDefault()
    if (!url) return alert("Please enter a YouTube URL")
    if (!videoId) return alert("Please enter a valid YouTube video or Shorts URL")
    navigate('/LectureNotes')
  }

  return (
    <div className='mt-30 flex flex-col items-center'>
      <div className="flex flex-col items-center w-full">
        <h1 className='font-bold text-3xl text-center'>
          Welcome to <span className="text-black">Lecture</span><span className="text-[#0D6EFD]">Notes</span>
        </h1>
        
        <div className='text-center mt-20 flex items-center justify-center'>
          <div className="hidden sm:block w-20"></div> 
          
          <form className="flex items-center">
            <input 
              type="text" 
              placeholder='paste the youtube video link here to go'
              className='border-2 w-100 h-10 p-2'
              onChange={(e)=> setUrl(e.target.value)}
            />
            <button 
              onClick={handleClick} 
              className='border-black border cursor-pointer px-4 p-1 m-2 hover:bg-green-200 rounded-2xl'
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
