import React from 'react';
import '../../src/style/index.css'
import '../style/responsive-design/about-page.css'

function About() {
  return ( 
    <div className='About'>
      <div className='about-container'>
        <div className='About-pages'>
         <p>
            Welcome to the <span style={{color: "#F6B22C" }}>Car Features Comparison System</span>,
            your go-to platform for finding the perfect car through 
            detailed side-by-side comparisons. This website allows
            you to compare <span style={{color: "#5AF055"}}> two car </span> 
            models at a time, analyzing key features such as <span style={{color: "#F7FB18"}}> 
            price, engine specifications, horsepower, top speed, fuel economy, and emissions</span>.
            Our intuitive design and scoring system help you make 
            informed decisions by highlighting the strengths of 
            each car. Whether you are a car enthusiast or a buyer, 
            our goal is to provide accurate and reliable data to 
            simplify your car selection process.
         </p>
       </div>
      </div>
    </div>
  );
}

export default About;
