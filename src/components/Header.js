import React from 'react';
import '../App.css'
function Header(props) {
    return (
        <div className='container mb-5'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3 id="logo">Attendance Management System</h3>
                <h4 id="head_easy_free_safe">Easy.Free.Safe</h4>
            </div>
        </div>
    );
}

export default Header;