import { Route, Routes } from "react-router-dom"
import Protected from "./pages/Protected"
import LoginButton from "./components/LoginButton"
import Sidebar from "./pages/Sidebar"
import Home from "./pages/Home"

function App() {
  return (
        <Routes>
          <Route element={<Sidebar />}>
          <Route path="/commercial/tmplogin" element={<LoginButton />} />
          <Route path="/commercial/" element={<Home />} />
          </Route>
          <Route element={<Protected />}>
          </Route>
        </Routes>
  )
}

export default App


// import { Button } from "@/components/ui/button"
 
// function App() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-svh">
//       <Button>Click me </Button>
//     </div>
//   )
// }
 
// export default App