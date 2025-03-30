import React, { useState } from 'react';
import '../../src/style/index.css'
import '../style/responsive-design/contact-responsive.css'
import { sendFeedback } from '../shared/helper';

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendFeedback(formData)
    setFormData({
      fullName: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className='contact-container'>
      <h2>Contact Us</h2>
      <p>We are here to help you! Let us know how we can best serve you.</p>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>

          <input
            type='text'
            name='fullName'
            placeholder='Full Name'
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="message"
            placeholder="Message...."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        <button type="submit" className="submit-button">Submit</button>

      </form>
    </div>
  )

}

export default Contact;
