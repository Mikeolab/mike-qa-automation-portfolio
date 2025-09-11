import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashCookIcon from "../../assets/images/dash-cook.svg";
import LeftArrowIcon from "../../components/icons/LeftArrowIcon";

const BusinessDetailsPage = () => {
  const navigate = useNavigate();

  // Add this query hook
  const { data: businessDetails } = useQuery({
    queryKey: ["businessDetails"],
    enabled: false, // Disable fetching since we only want cached data
  });

  console.log(businessDetails);
  if (!businessDetails?.data) return <></>;

  const {
    id,
    created_at,
    updated_at,
    name,
    description,
    mobile_no,
    country_code,
    address,
    address2,
    city,
    state,
    country,
    postal_code,
    status,
    created_by,
    updated_by,
    client,
    business_type,
  } = businessDetails.data;

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <Link to="/customer/dashboard" className="o-dasboard__backbtn">
        <LeftArrowIcon />
        BACK
      </Link>
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-general-dashboard__businesstab">
          <h2 className="o-general-dashboard__businesstitle">
            Business detail
          </h2>
          <div className="o-general-dashboard__businessroll o-general-dashboard__businessroll--half">
            <div className="roll-part">
              <label>Business name</label>
              <p>{name}</p>
            </div>
            <div className="roll-part">
              <label>Phone number</label>
              <p>{mobile_no}</p>
            </div>
          </div>
          <div className="o-general-dashboard__businessroll o-general-dashboard__businessroll--half">
            <div className="roll-part">
              <label>Address1</label>
              <p>{address}</p>
            </div>
            <div className="roll-part">
              <label>Address2</label>
              <p>{address2 ? address2 : "N/A"}</p>
            </div>
            <div className="roll-part">
              <label>Country</label>
              <p>{country}</p>
            </div>
            <div className="roll-part">
              <label>City</label>
              <p>{mobile_no}</p>
            </div>
          </div>
          <div className="o-general-dashboard__businessroll o-general-dashboard__businessroll--half">
            <div className="roll-part">
              <label>State</label>
              <p>{state}</p>
            </div>
            <div className="roll-part">
              <label>ZIP/Postcode</label>
              <p>{postal_code}</p>
            </div>
          </div>
          <div className="o-general-dashboard__businessroll">
            <label>Other detail</label>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <img
        src={DashCookIcon}
        alt="dash Cook"
        className="o-dasboard__dashcall"
      ></img>
    </div>
  );
};

export default BusinessDetailsPage;
