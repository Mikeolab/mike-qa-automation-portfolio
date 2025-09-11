import { Link } from "react-router-dom";
import BackButton from "../../../components/shared/BackButton";
import { useGetCallListDetailsQuery } from "../../../hooks/api/useGetCallListDetailsQuery";
import { useState } from "react";
import SearchInput from "../../../components/admin/SearchInput";
import FilterAgentsByClient from "../../../components/admin/FilterAgentsByClient";
import { DEFAULT_PAGE_SIZE } from "../../../lib/constants";
import Pagination from "../../../components/shared/Pagination";

const LoadingSkeleton = () => (
  <li className="o-agentlist__item animate-pulse">
    {/* <div className="o-agentlist__items o-agentlist__items--small">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div> */}
    <div className="o-agentlist__items">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="o-agentlist__items o-agentlist__items--small1">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="o-agentlist__items o-agentlist__items--small1">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
    <div className="o-agentlist__items o-agentlist__items--small1">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="o-agentlist__items o-agentlist__items--large">
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </li>
);

const EmptyState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500 text-lg text-center">No records found</p>
  </div>
);

const MyCallList = () => {
  const [searchParams, setSearchParams] = useState({
    search: "",
    client: "",
    page: 1,
  });

  const { data, isPending, isError } = useGetCallListDetailsQuery(searchParams);
  const handleSearchChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };
  const handleClientChange = (client) => {
    setSearchParams((prev) => ({ ...prev, client }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-dasboard__filterlistdashboard o-general-dashboard__promptfilter">
          <h2 className="o-dasboard__title my-call-title">My Calls</h2>
          <div className="o-agentlist__headsearch">
            <div className="form-group">
              {/* <label>Search by</label> */}
              <SearchInput
                name="search"
                value={searchParams.search}
                onChange={handleSearchChange}
                title={"number, Agent ID"}
                className="input-area"
              />
              {/* <input
              type="text"
              placeholder="number, Agent ID"
              className="input-area"
            /> */}
            </div>
            <FilterAgentsByClient
              value={searchParams.client}
              onChange={handleClientChange}
            />
          </div>
        </div>
        {isPending ? (
          <LoadingSkeleton />
        ) : data?.count <= 0 || isError ? (
          <EmptyState />
        ) : (
          <ul className="o-dasboard__calllistdashboard">
            {data?.data?.map((item, index) => (
              <li key={index}>
                <div className="part">
                  <div className="part-one">
                    <label>Number</label>
                    <p>
                      <svg
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.3332 13.4334V15.9334C17.3341 16.1655 17.2866 16.3952 17.1936 16.6079C17.1006 16.8205 16.9643 17.0114 16.7933 17.1683C16.6222 17.3252 16.4203 17.4446 16.2005 17.519C15.9806 17.5934 15.7477 17.621 15.5165 17.6001C12.9522 17.3214 10.489 16.4452 8.32486 15.0417C6.31139 13.7623 4.60431 12.0552 3.32486 10.0417C1.91651 7.86775 1.04007 5.39258 0.76653 2.81675C0.745705 2.5863 0.773092 2.35405 0.846947 2.13477C0.920801 1.91549 1.03951 1.71399 1.1955 1.5431C1.3515 1.37221 1.54137 1.23567 1.75302 1.14218C1.96468 1.04869 2.19348 1.0003 2.42486 1.00008H4.92486C5.32928 0.9961 5.72136 1.13931 6.028 1.40302C6.33464 1.66674 6.53493 2.03295 6.59153 2.43341C6.69705 3.23347 6.89274 4.01902 7.17486 4.77508C7.28698 5.07335 7.31125 5.39751 7.24478 5.70915C7.17832 6.02079 7.02392 6.30684 6.79986 6.53341L5.74153 7.59175C6.92783 9.67804 8.65524 11.4055 10.7415 12.5917L11.7999 11.5334C12.0264 11.3094 12.3125 11.155 12.6241 11.0885C12.9358 11.022 13.2599 11.0463 13.5582 11.1584C14.3143 11.4405 15.0998 11.6362 15.8999 11.7417C16.3047 11.7989 16.6744 12.0028 16.9386 12.3147C17.2029 12.6266 17.3433 13.0247 17.3332 13.4334Z"
                          stroke="#3D84DA"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item?.number}
                    </p>
                  </div>
                  <div className="part-one">
                    <label>Client</label>
                    <p>{item?.client_name}</p>
                  </div>
                  <div className="part-one">
                    <label>Call received</label>
                    <p>{item?.total_calls}</p>
                  </div>
                </div>
                <Link
                  to="/admin/call/call-details"
                  className="view-details"
                  state={{ number: item?.number, client: item?.client }}
                >
                  view details
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="my-3 flex justify-center items-center">
          {!isPending && !isError && data?.data?.length > 0 && (
            <Pagination
              currentPage={searchParams.page}
              totalPages={Math.ceil(data?.count / DEFAULT_PAGE_SIZE)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCallList;
