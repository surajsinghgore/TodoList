import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"

import GetNotes from "./GetNotes";
import PostNotes from "./PostNotes";
import UpdateNotes from "./UpdateNotes";
import Header from '../components/Header';


function App() {
  return (
    <>
 
    <Header />
    <BrowserRouter>
      
       <Routes>
      
           <Route path="/" element={<GetNotes />} />
           <Route path="/post" element={<PostNotes />} />
    
           <Route path="/update" element={<UpdateNotes />} />
           {/* <Route path="*" element={<PageNotFound />} /> */}
       </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
