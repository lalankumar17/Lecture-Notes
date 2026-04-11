import {create} from 'zustand'
import { jsPDF } from 'jspdf';

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const extractYouTubeVideoId = (url) => {
    try {
        const parsedUrl = new URL(url.trim());
        const hostname = parsedUrl.hostname.replace(/^www\./, "");
        const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

        if (hostname === "youtu.be") {
            return pathSegments[0] && YOUTUBE_ID_PATTERN.test(pathSegments[0]) ? pathSegments[0] : "";
        }

        if (!["youtube.com", "m.youtube.com"].includes(hostname)) {
            return "";
        }

        const watchVideoId = parsedUrl.searchParams.get("v");
        if (watchVideoId && YOUTUBE_ID_PATTERN.test(watchVideoId)) {
            return watchVideoId;
        }

        const videoPathIndex = ["shorts", "embed", "live", "v"].includes(pathSegments[0]) ? 1 : -1;
        const pathVideoId = videoPathIndex > 0 ? pathSegments[videoPathIndex] : "";

        return pathVideoId && YOUTUBE_ID_PATTERN.test(pathVideoId) ? pathVideoId : "";
    } catch {
        return "";
    }
};

export const useNoteStore = create((set,get)=>({
    url:"",
    player:null,
    videoId:"",
    notes:[],
    title: "",
    description: "",
    selectedNoteIndex: null,

    setPlayer: (player) => set({ player }),
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setSelectedNoteIndex: (selectedNoteIndex) => set({ selectedNoteIndex }),

    videoIdExtractor: (url) => {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            localStorage.setItem("videoId", videoId);
        } else {
            localStorage.removeItem("videoId");
        }
        set({ videoId });
        return videoId;
      },

    setUrl:  (newUrl)  =>  {
        set({url:newUrl});
        get().videoIdExtractor(newUrl);
    },

    setTime : ()=>{
        const player = get().player;
        return player ? player.getCurrentTime() : 0;
    },

    jumpToTime: (time) => {
        const player = get().player;
        if (player && typeof time === "number" && !Number.isNaN(time)) {
            player.seekTo(time, true);
            if (typeof player.playVideo === "function") {
                player.playVideo();
            }
        }
    },

    addNote: (note) => {
        let notes = [];
      
        try {
          const parsed = JSON.parse(localStorage.getItem("ytNotes"));
          notes = Array.isArray(parsed) ? parsed : []; 
        } catch {
          notes = [];
        }
      
        const updated = [...notes, note];
      
        localStorage.setItem("ytNotes", JSON.stringify(updated));
        set({ notes: updated });
      },

    updateNote: (index, updatedNote) => {
        const { notes } = get();
        const updatedNotes = [...notes];
        updatedNotes[index] = { ...updatedNotes[index], ...updatedNote };
        localStorage.setItem("ytNotes", JSON.stringify(updatedNotes));
        set({ notes: updatedNotes });
    },

    deleteNote: (index) => {
        const { notes, selectedNoteIndex } = get();
        const updatedNotes = notes.filter((_, i) => i !== index);
        localStorage.setItem("ytNotes", JSON.stringify(updatedNotes));
        
        let newState = { notes: updatedNotes };
        
        // Handle selection reset/adjustment
        if (selectedNoteIndex === index) {
            newState.selectedNoteIndex = null;
            newState.title = "";
            newState.description = "";
        } else if (selectedNoteIndex > index) {
            newState.selectedNoteIndex = selectedNoteIndex - 1;
        }
        
        set(newState);
    },

    loadNotes :()=>{
        let notes = [];

        try {
            const parsedNotes = JSON.parse(localStorage.getItem("ytNotes"));
            notes = Array.isArray(parsedNotes) ? parsedNotes : [];
        } catch {
            notes = [];
        }

        set({notes: notes});
    },

    generatePDF: () => {
        const notes = JSON.parse(localStorage.getItem("ytNotes")) || [];
      
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const textWidth = 190;
      
        let y = 10;
      
        doc.setFontSize(16);
        doc.text("YouTube Notes", 10, y);
        y += 10;
      
        notes.forEach((note, index) => {
          const explanation = doc.splitTextToSize(note.description || "-", textWidth);
          const noteHeight = 6 + explanation.length * 6 + 4;

          if (y + noteHeight > pageHeight - 10) {
            doc.addPage();
            y = 10;
          }
      
          doc.setFontSize(12);
          doc.text(`${index + 1}. ${note.title || "No Title"}`, 10, y);
          y += 6;
      
          doc.text(explanation, 10, y);
          y += explanation.length * 6 + 4;
        });
      
        doc.save("yt-notes.pdf");
      },

      clearNotes:()=>{
        localStorage.removeItem("ytNotes");
        set({
            notes:[],
            title: "",
            description: "",
            selectedNoteIndex: null
        });
      }

}))
