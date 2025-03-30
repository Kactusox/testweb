import CompareCars from './comparisonSection';
import PopularComparisons from './popularComparisons';
import Footer from './footer'
import Header from './components/Header';

function Home() {
  return (

    <div className='unite'>
         <Header />
        <CompareCars />
        <PopularComparisons />
        <Footer />

    </div>

   
    

  );
}


export default Home;


