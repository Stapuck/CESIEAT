import { Route, Routes } from "react-router-dom"
import Protected from "./pages/Protected"
import LoginButton from "./components/LoginButton"
import Sidebar from "./pages/Sidebar"
import Home from "./pages/Home"
import Tmp1 from "./pages/Tmp1"
import Tmp2 from "./pages/Tmp2"
import Tmp3 from "./pages/Tmp3"
import Tmp4 from "./pages/Tmp4"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
        <Routes>
          <Route element={<Sidebar />}>
          <Route path="/commercial/tmplogin" element={<LoginButton />} />
          <Route path="/commercial/" element={<Home />} />
          <Route path="/commercial/Tmp1" element={<Tmp1 />} />
          <Route path="/commercial/Tmp2" element={<Tmp2 />} />
          <Route path="/commercial/Tmp3" element={<Tmp3 />} />
          <Route path="/commercial/Tmp4" element={<Tmp4 />} />
          <Route path="/commercial/dashboard" element={<Dashboard />} />
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