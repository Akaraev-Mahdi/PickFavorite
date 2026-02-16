import { Route, Routes } from "react-router-dom"
import Home from '../page/Home/home.tsx'
import Result from '../page/Result/result.tsx'
import Create from '../page/Create/create.tsx'
import Tournament from '../page/Tournament/tournament.tsx'
import Registration from '../page/Auth/registrtation'
import Login from '../page/Auth/login'
import Activity from "../page/Activity/activity.tsx"

function AppRouter() {
    return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path={"/result"  + "/:id"} element={<Result/>}/>
        <Route path="/create" element={<Create/>}/>
        <Route path={"/tournament" + "/:id"} element={<Tournament/>}/>
        <Route path="/activity_center" element={<Activity/>}/>
      </Routes>
    )
  }
  
  export default AppRouter