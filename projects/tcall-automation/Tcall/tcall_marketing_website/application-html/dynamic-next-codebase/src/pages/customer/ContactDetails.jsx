import { Link } from "react-router-dom";
import profileImage from "../../assets/images/profile-image.png";

const ContactDetails = () => {
  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <Link to="/customer/dashboard" className="o-dasboard__backbtn">
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3867 12.2266H5.38672"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.3867 19.2266L5.38672 12.2266L12.3867 5.22656"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        BACK
      </Link>
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-general-dashboard__contacttab">
          <h2 className="o-general-dashboard__businesstitle">
            Personal detail
          </h2>
          <div className="o-general-dashboard__contactwraparea">
            {/* Profile Area */}
            <div className="o-general-dashboard__profilearea">
              <div className="o-general-dashboard__contactprofile">
                <span>
                  <img src={profileImage} alt="profile image" />
                </span>
                <a href="#" className="edtbtn">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9.91662 1.75083C10.0698 1.59762..."
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="o-general-dashboard__contact-form">
              <form>
                <div className="o-general-dashboard__contactgroup">
                  <label>First name</label>
                  <input type="text" placeholder="Enter First name" />
                </div>
                <div className="o-general-dashboard__contactgroup">
                  <label>Last Name</label>
                  <input type="text" placeholder="Enter Last Name" />
                </div>
                <div className="o-general-dashboard__contactgroup">
                  <label>Phone number</label>
                  <input
                    type="text"
                    placeholder="Enter Personal phone number"
                  />
                </div>
                <div className="o-general-dashboard__contactbtn">
                  <button type="submit" className="o-general-dashboard__button">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
