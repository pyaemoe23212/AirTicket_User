import HeroSection from "../components/HeroSection";
import SearchForm from "../components/SearchForm";
import AboutSection from "../components/AboutSection";
import AdvertisementSection from "../components/AdvertisementSection";
import {useState} from "react";
import { useNavigate } from "react-router-dom";


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
      <div  className="relative -mt-20 z-20">
      <SearchForm tripType={tripType} onTripTypeChange={setTripType} onSearch={handleSearch} />
      </div>
      <AdvertisementSection />
      <AboutSection />
    </div>
  );
}

export default Home;
