import { BrowserRouter } from "react-router-dom";
import AppRouter from "./component/AppRouter";
import Header from "./component/header/header";
import { useEffect } from "react";
import { useLazyChekAuthQuery } from "./redux/userApi";

function App() {

  const [trigger] = useLazyChekAuthQuery()

  useEffect(() => {
    trigger()
  }, [])

  return (
    <BrowserRouter>
      <Header/>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App