import React from "react";

import { Link } from "react-router-dom";
import GreaterThanIcon from "../icons/GreaterThanIcon";
export default function ClientBusinessRowItem({ business }) {
  return (
    <ul className="o-agentlist__tabble o-agentlist__tabble--body">
      <li>{business.rquested_by}</li>
      <li>{business.name}</li>
      <li>{business.mobile_no}</li>
      <li>{business.rquested_by_email}</li>
      <li>{business.business_domain}</li>
      <li>
        <Link
          to={`/admin/business-approval/${business.id}`}
          data-target="businessDetails"
          className="approved js-open-modal"
        >
          {business.status}
          <GreaterThanIcon />
        </Link>
      </li>
    </ul>
  );
}
