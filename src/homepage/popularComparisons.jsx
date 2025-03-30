import React from 'react';
import '../style/mainPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faGasPump, faGear } from '@fortawesome/free-solid-svg-icons';
import cobaltImg from '../img/cobalt.png'
import merc from '../img/merc.png'


function PopularComparisons() {
  return (
    <section className="popular-comparisons">
      <h3>Popular Comparisons</h3>
      <hr></hr>
      <div className="comparison-cards">
        <div className="card">
          <img src={cobaltImg} alt="Cobalt" />
          <p>GM Cobalt  vs GM, Gentra, 2021</p>
          <div className='iconLink'>
            <FontAwesomeIcon icon={faGauge} />
            <FontAwesomeIcon icon={faGasPump} />
            <FontAwesomeIcon icon={faGear}/>
            <a href='#'>View Details</a>
          </div>
          
        </div>
        <div className="card">
          <img src={merc} alt="Merc" />
          <p>Mercedes-Benz vs BMW, 2023</p>
            <div className='iconLink'>
              <FontAwesomeIcon icon={faGauge} />
              <FontAwesomeIcon icon={faGasPump} />
              <FontAwesomeIcon icon={faGear}/>
              <a href='#'>View Details</a>
            </div>
        </div>
      </div>
    </section>
  );
}


export default PopularComparisons;