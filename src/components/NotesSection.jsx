import { useNoteStore } from "../store/useNotes"
import { useEffect } from "react"
import { Trash2 } from "lucide-react"

const NotesSection = () => {

  const { 
    setTime, addNote, loadNotes, notes, jumpToTime, updateNote, deleteNote, 
    title, setTitle, description, setDescription, selectedNoteIndex, setSelectedNoteIndex 
  } = useNoteStore();

  const isModified = selectedNoteIndex !== null && 
    (title !== (notes[selectedNoteIndex]?.title || "") || 
     description !== (notes[selectedNoteIndex]?.description || ""));

  const handleAction = () => {
    if (isModified) {
      updateNote(selectedNoteIndex, { title, description });
      // Clear after successful update to return to Add mode
      setTitle("");
      setDescription("");
      setSelectedNoteIndex(null);
    } else {
      const currentTime = setTime();
      const note = { time: currentTime, title, description };
      addNote(note);
      setTitle("");
      setDescription("");
      setSelectedNoteIndex(null);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [loadNotes])


  return (
    <div className="border mt-10 p-2 w-6xl h-60 flex gap-4 text-xl">
      <div className="overflow-y-auto w-80 shrink-0" >
        
        <ul>
          <h2 className="text-center font-bold underline bg-green-200 p-1">Notes</h2>
          {
            notes.map((note,index)=>(
              <li
                className={`p-1 cursor-pointer rounded flex justify-between items-center group ${selectedNoteIndex === index ? "bg-[#0D6EFD] text-white" : "hover:bg-blue-100"}`}
                key={index}
                onClick={() => {
                  setSelectedNoteIndex(index);
                  setTitle(note.title || "");
                  setDescription(note.description || "");
                  jumpToTime(note.time);
                }}
              >
                <h3 className="truncate flex-1">{note.title || "No Title"}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this note?")) {
                      deleteNote(index);
                    }
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    selectedNoteIndex === index 
                    ? "text-white/70 hover:text-white hover:bg-white/10" 
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  title="Delete topic"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          }
        </ul>
        
      </div>

      <div className="flex flex-1 min-w-0 gap-4">
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" id="title" placeholder="Title" className="border w-full p-2" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="desc" id="desc" placeholder="Description" className="border w-full h-40 p-2"></textarea>
        </div>
        <div className="flex justify-center items-center">
          <button onClick={handleAction} className="cursor-pointer px-4 p-1 hover:bg-green-200 rounded-2xl">
            {isModified ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>

    
  )
}

export default NotesSection
