import Header from "./header";
import SecondaryContainer from "./secondaryContainer";
import PrimaryContainer from "./primaryContainer";

const Home = () =>{
    return <>
    <Header/>
    <div className=" flex  flex-col justify-between w-2/3  mx-auto">
      <PrimaryContainer/>
      <SecondaryContainer/>
    </div>
    
    </>
}

export default Home;