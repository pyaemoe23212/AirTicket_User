import HeroSection from "../components/HeroSection"
import SearchForm from "../components/SearchForm"
import AboutSection from "../components/AboutSection"
import {useState} from "react"
import { useNavigate } from "react-router"


function Home(){
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round-trip");
  
  const handleSearch = (searchData) => {
    navigate("/departure", {
      state: { tripType, searchData },
    });
  };

  return(
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <SearchForm tripType={tripType} onTripTypeChange={setTripType} onSearch={handleSearch} />
      <AboutSection />
    </div>
  )
}

export default Home;
